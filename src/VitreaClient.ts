import { Mutex }                  from 'async-mutex'
import { Events }                 from './utilities/Events'
import { Timeout }                from './socket/Timeout'
import { AbstractSocket }         from './socket/AbstractSocket'
import { ResponseFactory }        from './responses/helpers'
import { SplitMultipleBuffers }   from './utilities/SplitMultipleBuffers'
import { Login, ToggleHeartbeat } from './requests'
import { VitreaHeartbeatHandler } from './socket/VitreaHeartbeatHandler'
import * as Core                  from './core'
import {
    Acknowledgement,
    GenericUnusedResponse,
    KeyStatus
} from './responses'
import {
    ConnectionConfigs,
    ConnectionConfigParser,
    SocketConfigs,
    SocketConfigParser
} from './configs'


export class VitreaClient extends AbstractSocket {
    protected readonly mutex = new Mutex()
    protected readonly configs: ConnectionConfigs

    protected constructor(configs: ConnectionConfigs, socketConfigs: SocketConfigs) {
        super(configs.host, configs.port, socketConfigs)
        this.configs = configs
        this.heartbeat = new VitreaHeartbeatHandler(this, socketConfigs.heartbeatInterval)
    }

    protected async acquire(eventName: string) {
        this.log.debug('Waiting for mutex', { eventName })

        const release = await this.mutex.acquire()

        this.log.debug('Acquired mutex', { eventName })

        return async () => {
            release()

            this.log.debug('Released mutex', { eventName })
        }
    }

    public async send<T extends Core.BaseRequest, R extends Core.BaseResponse>(request: T): Promise<R> {
        const eventName = { eventName: request.eventName }

        const release = await this.acquire(eventName.eventName)

        return new Promise(res => {
            this.log.info('Sending data', request.logData)

            let callback: (data: R) => void

            const onTimeout = (error: Error) => {
                this.log.error(error.message, request.logData)

                this.removeListener(request.eventName, callback)

                release()
            }

            const timeout = Timeout.create(this.socketConfigs.requestTimeout, {
                onTimeout,
                message: 'Sending timeout reached',
            })

            callback = data => {
                timeout.stop()

                setTimeout(() => {
                    release()
                    res(data)
                }, this.socketConfigs.requestBuffer)
            }

            this.once(request.eventName, callback)

            this.write(request.build())
        })
    }

    protected shouldLogResponse(response: Core.BaseResponse): boolean {
        return !this.socketConfigs.ignoreAckLogs
            || !(response instanceof Acknowledgement || response instanceof GenericUnusedResponse)
    }

    protected async handleConnect() {
        await super.handleConnect()

        await this.send(new ToggleHeartbeat())

        await this.send(new Login(this.configs.username, this.configs.password))
    }

    protected handleData(data: Buffer): void {
        const split = SplitMultipleBuffers.handle(data)

        if (split.length > 1) {
            return split.forEach(buffer => this.handleData(buffer))
        }

        data = split[0]

        const response = ResponseFactory.find(data, this.configs.version)

        if (!response) {
            this.emit(Events.UNKNOWN_DATA, data)

            this.handleUnknownData(data)

            return
        }

        if (this.shouldLogResponse(response)) {
            this.log.info('Data Received', response.logData)
        }

        this.emit(response.eventName, response)
    }

    protected handleUnknownData(data: Buffer): void {
        this.log.warn('Ignoring unrecognized received data', { raw: data.toString('hex') })
    }

    public onKeyStatus(listener: (status: KeyStatus) => void): void {
        this.on(Events.STATUS_UPDATE, listener)
    }

    public static create(configs: Partial<ConnectionConfigs> = {}, socketConfigs: Partial<SocketConfigs> = {}) {
        const parsedConnectionConfigs = ConnectionConfigParser.create(configs)
        const parsedSocketConfigs = SocketConfigParser.create(socketConfigs)
        const redact = (str: string) => `${str[0]}***${str[str.length - 1]}`

        const instance = new this(parsedConnectionConfigs, parsedSocketConfigs)

        instance.log.debug('VitreaClient instance created', {
            connection: {
                host:     parsedConnectionConfigs.host,
                username: redact(parsedConnectionConfigs.username),
                password: redact(parsedConnectionConfigs.password),
                port:     parsedConnectionConfigs.port,
                version:  parsedConnectionConfigs.version,
            },
            socket: {
                shouldReconnect: parsedSocketConfigs.shouldReconnect,
                requestBuffer:   parsedSocketConfigs.requestBuffer,
                requestTimeout:  parsedSocketConfigs.requestTimeout
            },
        })

        return instance
    }
}
