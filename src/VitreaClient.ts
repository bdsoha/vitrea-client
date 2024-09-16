import { Mutex }                         from 'async-mutex'
import { Events }                        from './utilities/Events'
import { Timeout }                       from './socket/Timeout'
import { KeyStatus }                     from './responses'
import { ProtocolVersion }               from './utilities/ProtocolVersion'
import { ResponseFactory }               from './responses/helpers'
import { SplitMultipleBuffers }          from './utilities/SplitMultipleBuffers'
import { Login, ToggleHeartbeat }        from './requests'
import { VitreaHeartbeatHandler }        from './socket/VitreaHeartbeatHandler'
import { VBoxConfigs, VBoxConnection }   from './utilities/VBoxConnection'
import { AbstractSocket, SocketConfigs } from './socket/AbstractSocket'
import * as Core                         from './core'


export class VitreaClient extends AbstractSocket {
    protected readonly mutex = new Mutex()
    protected readonly configs: VBoxConfigs
    protected readonly version: ProtocolVersion

    protected constructor(configs: Required<VBoxConfigs>, socketConfigs: SocketConfigs) {
        super(configs.host, configs.port, socketConfigs)
        this.configs = configs
        this.heartbeat = new VitreaHeartbeatHandler(this)
    }

    protected async acquire(eventName: string) {
        this.log.debug('Waiting for mutex', eventName)

        const release = await this.mutex.acquire()

        this.log.debug('Acquired mutex', eventName)

        return release
    }

    public async send<T extends Core.BaseRequest, R extends Core.BaseResponse>(request: T): Promise<R> {
        const eventName = { eventName: request.eventName }

        const release = await this.acquire(eventName.eventName)

        return new Promise(res => {
            this.log.info('Sending data', request.logData)

            let callback: (data: R) => void

            const onTimeout = (error: Error) => {
                this.log.error(error.message, eventName)

                this.removeListener(request.eventName, callback)

                release()
            }

            const timeout = Timeout.create(1000, {
                onTimeout,
                message: 'Sending timeout reached',
            })

            callback = data => {
                timeout.stop()

                setTimeout(() => {
                    release()
                    res(data)
                }, 250)
            }

            this.once(request.eventName, callback)

            this.write(request.build())
        })
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

        if (response) {
            this.log.info('Data Received', response.logData)

            this.emit(response.eventName, response)
        } else {
            this.emit(Events.UNKNOWN_DATA, data)
        }
    }

    protected handleUnknownData(data: Buffer): void {
        this.log.warn('Ignoring unrecognized received data', { raw: data.toString('hex') })
    }

    public onKeyStatus(listener: (status: KeyStatus) => void): void {
        this.on(Events.STATUS_UPDATE, listener)
    }

    public static create(configs: Partial<VBoxConfigs> = {}, socketConfigs: SocketConfigs = {}) {
        return new this(
            VBoxConnection.create(configs),
            socketConfigs
        )
    }
}
