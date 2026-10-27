import { EventEmitter } from 'node:events'
import pTimeout, { TimeoutError } from 'p-timeout'
import { ConnectionConfigParser, SocketConfigParser } from './configs'
import type { BaseRequest, BaseResponse } from './core'
import * as Exceptions from './exceptions'
import { ScopedLogger } from './logging'
import { Heartbeat, Login, ToggleHeartbeat } from './requests'
import type { Acknowledgement, KeyStatus } from './responses'
import { ResponseFactory } from './responses/helpers'
import { Connection } from './socket/Connection'
import { HeartbeatMonitor } from './socket/HeartbeatMonitor'
import { PendingRequests } from './socket/PendingRequests'
import { RequestThrottler } from './socket/RequestThrottler'
import type { ConnectionConfigs, ProtocolVersion, SocketConfigs } from './types'
import { Events } from './utilities/Events'
import { MessageIdSequence } from './utilities/MessageIdSequence'

export class VitreaClient<
    V extends ProtocolVersion = ProtocolVersion,
> extends EventEmitter {
    protected readonly log: ScopedLogger
    protected readonly connection: Connection
    protected readonly pending: PendingRequests
    protected readonly heartbeat: HeartbeatMonitor
    protected readonly throttler: RequestThrottler
    protected readonly messageIDs = new MessageIdSequence()
    protected hasConnected = false

    protected constructor(
        protected readonly configs: ConnectionConfigs & { version: V },
        protected readonly socketConfigs: SocketConfigs,
    ) {
        super()
        this.setMaxListeners(60)

        const log = new ScopedLogger(socketConfigs.log, { host: configs.host })

        this.log = log.child('client')
        this.pending = new PendingRequests(configs.version)
        this.throttler = new RequestThrottler(socketConfigs)
        this.connection = new Connection(
            configs.host,
            configs.port,
            socketConfigs,
            log.child('connection'),
        )
        this.heartbeat = new HeartbeatMonitor(
            socketConfigs.heartbeatInterval,
            () => this.send(new Heartbeat()),
            error => this.handleHeartbeatFailure(error),
            log.child('heartbeat'),
        )

        this.connection
            .on('open', generation => void this.handshake(generation))
            .on('frame', frame => this.handleFrame(frame))
            .on('close', () => this.heartbeat.stop())
    }

    public connect(): Promise<void> {
        return this.connection.connect()
    }

    public disconnect() {
        this.heartbeat.dispose()
        this.connection.disconnect()
    }

    public send<R extends BaseResponse>(request: BaseRequest<R>): Promise<R> {
        return this.throttler.process(() => this.exchange(request))
    }

    protected sendOn<R extends BaseResponse>(
        request: BaseRequest<R>,
        generation: number,
    ): Promise<R> {
        return this.throttler.process(() => this.exchange(request, generation))
    }

    protected async exchange<R extends BaseResponse>(
        request: BaseRequest<R>,
        generation?: number,
    ): Promise<R> {
        request.withMessageID(this.messageIDs.next())

        const reply = this.pending.wait(request)

        try {
            for (let attempt = 0; ; attempt++) {
                if (
                    generation !== undefined
                    && generation !== this.connection.generation
                ) {
                    throw new Exceptions.NoConnectionException()
                }

                this.log.traffic('Request sent', request)

                await this.connection.write(request.build())

                try {
                    return await pTimeout(reply, {
                        milliseconds: this.socketConfigs.requestTimeout,
                    })
                } catch (error) {
                    if (
                        !(error instanceof TimeoutError)
                        || attempt >= this.socketConfigs.maxRetries
                    ) {
                        throw error
                    }

                    this.log.warn('Request timed out, resending', {
                        command: request.commandName,
                        messageID: request.messageID,
                        attempt: attempt + 1,
                    })
                }
            }
        } finally {
            this.pending.forget(request)
        }
    }

    protected async handshake(generation: number) {
        this.heartbeat.start()

        try {
            await this.sendOn(new ToggleHeartbeat(), generation)

            const login = await this.sendOn(
                new Login(this.configs.username, this.configs.password),
                generation,
            )

            if (generation !== this.connection.generation) {
                return
            }

            if (!login.isOK) {
                this.log.error('Login was not acknowledged', {
                    type: login.type,
                })
                this.emit(Events.LOGIN_FAILED, login)

                return
            }

            this.connection.markHealthy(generation)

            if (this.hasConnected) {
                this.heartbeat.countReconnect()
                this.emit(Events.RECONNECTED)
            }

            this.hasConnected = true
        } catch (error) {
            if (generation !== this.connection.generation) {
                return
            }

            this.log.error('Handshake failed', { error })
            this.connection.fail(generation, 'handshake failed')
        }
    }

    protected handleHeartbeatFailure(error: unknown) {
        this.log.warn('Heartbeat failed', { error })
        this.connection.fail(this.connection.generation, 'heartbeat failed')
    }

    protected handleFrame(frame: Buffer) {
        const response = ResponseFactory.find(frame, this.configs.version)

        if (!response) {
            this.log.warn('Unrecognized frame ignored', {
                raw: frame.toString('hex'),
            })
            this.emit(Events.UNKNOWN_DATA, frame)

            return
        }

        this.log.traffic('Response received', response)
        this.pending.settle(response)
        this.emit(response.eventName, response)
    }

    public onKeyStatus(listener: (status: KeyStatus) => void): void {
        this.on(Events.STATUS_UPDATE, listener)
    }

    public onReconnect(listener: () => void): void {
        this.on(Events.RECONNECTED, listener)
    }

    public onLoginFailed(listener: (ack: Acknowledgement) => void): void {
        this.on(Events.LOGIN_FAILED, listener)
    }

    public static create<V extends ProtocolVersion = typeof ProtocolVersion.V2>(
        configs: Partial<ConnectionConfigs> & { version?: V } = {},
        socketConfigs: Partial<SocketConfigs> = {},
    ): VitreaClient<V> {
        const parsedConnectionConfigs = ConnectionConfigParser.create(
            configs,
        ) as ConnectionConfigs & { version: V }
        const parsedSocketConfigs = SocketConfigParser.create(socketConfigs)
        const redact = (str: string) => `${str[0]}***${str[str.length - 1]}`

        const instance = new VitreaClient(
            parsedConnectionConfigs,
            parsedSocketConfigs,
        )

        instance.log.debug('Client created', {
            connection: {
                ...parsedConnectionConfigs,
                username: redact(parsedConnectionConfigs.username),
                password: redact(parsedConnectionConfigs.password),
            },
            socket: {
                ...parsedSocketConfigs,
                log: undefined,
                socketSupplier: undefined,
            },
        })

        return instance
    }
}
