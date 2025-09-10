import { Events }                 from './utilities/Events'
import { AbstractSocket }         from './socket/AbstractSocket'
import { ResponseFactory }        from './responses/helpers'
import { RequestRetryHandler }    from './socket/RequestRetryHandler'
import { SplitMultipleBuffers }   from './utilities/SplitMultipleBuffers'
import { Login, ToggleHeartbeat } from './requests'
import { VitreaHeartbeatHandler } from './socket/VitreaHeartbeatHandler'
import pTimeout, { TimeoutError } from 'p-timeout'
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
    protected readonly retryHandler: RequestRetryHandler
    protected readonly configs: ConnectionConfigs

    protected constructor(configs: ConnectionConfigs, socketConfigs: SocketConfigs) {
        super(configs.host, configs.port, socketConfigs)
        this.configs = configs
        this.retryHandler = new RequestRetryHandler(socketConfigs)
        this.heartbeat = new VitreaHeartbeatHandler(socketConfigs.heartbeatInterval, this)
    }

    public async send<T extends Core.BaseRequest, R extends Core.BaseResponse>(request: T): Promise<R> {
        const eventName = { eventName: request.eventName }

        return this.retryHandler.processWithRetry<R>(eventName.eventName, async (resolve, reject) => {
            this.log.info('Sending data', request.logData)

            try {
                this.write(request.build())

                const result = await pTimeout(
                    new Promise<R>(res => this.once(request.eventName, res)),
                    { milliseconds: this.socketConfigs.requestTimeout }
                )
                resolve(result)
            } catch (error) {
                reject(error)
            }
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
                ...parsedConnectionConfigs,
                username: redact(parsedConnectionConfigs.username),
                password: redact(parsedConnectionConfigs.password),
            },
            socket: parsedSocketConfigs,
        })

        return instance
    }
}
