import { Timeout }                    from './Timeout'
import { EventEmitter }               from 'events'
import { WritableSocketContract }     from './WritableSocketContract'
import { AbstractHeartbeatHandler }   from './AbstractHeartbeatHandler'
import { LoggerContract, NullLogger } from '../core'
import * as Net                       from 'net'

export abstract class AbstractSocket extends EventEmitter implements WritableSocketContract {
    protected port : number
    protected host : string
    protected socket? : Net.Socket
    protected heartbeat? : AbstractHeartbeatHandler
    protected shouldReconnect : boolean
    protected readonly log : LoggerContract

    protected constructor(host : string, port : number, shouldReconnect  = true, logger:LoggerContract = null) {
        super()
        this.host            = host
        this.port            = port
        this.shouldReconnect = shouldReconnect
        this.log             = logger ?? new NullLogger()
    }

    public async connect() {
        this.log.debug('Attempting to make a connection')

        return new Promise((res, rej) => {
            if (this.socket) {
                const message = 'Socket already exists'

                this.log.error(message)

                return rej(new Error(message))
            }

            const timeout = Timeout.create(1000)

            const socket = new Net.Socket()
                .connect({
                    port: this.port,
                    host: this.host
                })
                .on('connect', () => {
                    timeout.stop()
                    res(null)
                    this.onConnect(socket)
                })
                .on('data', this.onData.bind(this))
                .on('end', this.onDisconnect.bind(this))
                .on('error', this.onError.bind(this))
        })
    }

    public disconnect() {
        if (this.socket) {
            this.log.info('Forced a disconnection')
            this.shouldReconnect = false
            this.socket.end()
            this.socket = undefined
            this.heartbeat?.pause()
        }
    }

    public async write(data : Buffer) : Promise<void> {
        return new Promise((res, rej) => {
            if (!this.socket) {
                return rej(new Error('Can\'t write, no socket connection established'))
            }

            this.socket.write(data, (error? : Error) => {
                this.restartHeartbeat()

                if (error) {
                    this.log.error(`Data written with an error - ${ error.message }`)

                    return rej(error)
                }

                res()
            })
        })
    }

    protected async onDisconnect() {
        this.log.debug('Connection closed')

        this.socket = undefined

        if (this.shouldReconnect) {
            this.log.info('Automatically reconnecting', { shouldReconnect: this.shouldReconnect })
            return await this.connect()
        }

        this.log.info('Not reconnecting', { shouldReconnect: this.shouldReconnect })
    }

    protected onError(error : Error) {
        this.shouldReconnect = false
        this.log.error(`An error occurred - ${ error.message }`)
    }

    protected async onConnect(socket : Net.Socket) {
        this.log.debug('Connection established')
        this.socket          = socket
        this.shouldReconnect = true
        this.restartHeartbeat()
    }

    protected restartHeartbeat() {
        if (this.heartbeat) {
            this.heartbeat.restart()
        }
    }

    protected abstract onData(data : Buffer) : void
}
