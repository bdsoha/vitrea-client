import { Login }                       from './requests/Login'
import { Mutex }                       from 'async-mutex'
import { Timeout }                     from './socket/Timeout'
import { AbstractSocket }              from './socket/AbstractSocket'
import { ProtocolVersion }             from './utilities/ProtocolVersion'
import { ResponseFactory }             from './responses/ResponseFactory'
import { ToggleHeartBeat }             from './requests/ToggleHeartBeat'
import { SplitMultipleBuffers }        from './utilities/SplitMultipleBuffers'
import { VitreaHeartbeatHandler }      from './socket/VitreaHeartbeatHandler'
import { VBoxConfigs, VBoxConnection } from './utilities/VBoxConnection'
import Net                             from 'net'
import * as Core                       from './core'

export class VitreaClient extends AbstractSocket {
    protected readonly mutex = new Mutex()
    protected readonly configs: VBoxConfigs
    protected readonly version: ProtocolVersion
    protected readonly log: Core.LoggerContract

    public constructor(configs: Required<VBoxConfigs>, logger: Core.LoggerContract = null) {
        super(configs.host, configs.port)
        this.configs = configs
        this.heartbeat = VitreaHeartbeatHandler.create(this)
        this.log = logger ?? new Core.NullLogger()
    }

    public async send<T extends Core.BaseRequest, R extends Core.BaseResponse>(request: T): Promise<R> {
        const eventName = { eventName: request.eventName }

        this.log.debug('Waiting for mutex', eventName)
        const release = await this.mutex.acquire()
        this.log.debug('Acquired mutex', eventName)

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

    protected async onConnect(socket: Net.Socket) {
        await super.onConnect(socket)

        await this.send(new ToggleHeartBeat())

        await this.send(new Login(this.configs.username, this.configs.password))
    }

    protected onData(data: Buffer): void {
        const split = SplitMultipleBuffers.handle(data)

        if (split.length > 1) {
            return split.forEach(buffer => this.onData(buffer))
        }

        data = split[0]

        const response = ResponseFactory.find(data, this.configs.version)

        if (response) {
            this.log.info('Data Received', response.logData)

            this.emit(response.eventName, response)
        } else {
            this.log.warn('Ignoring unrecognized received data', { raw: data.toString('hex') })
        }
    }

    public static create(configs: Partial<VBoxConfigs> = {}) {
        return new this(
            VBoxConnection.create(configs)
        )
    }
}
