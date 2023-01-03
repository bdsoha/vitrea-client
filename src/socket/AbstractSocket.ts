import {EventEmitter}             from 'events'
import {TimeoutException}         from '../TimeoutException'
// import {getLogger, Logger}        from '@/core/logger'
import {WritableSocketContract}   from '/WritableSocketContract'
import {AbstractHeartbeatHandler} from '/AbstractHeartbeatHandler'
import * as Net                   from 'net'

export abstract class AbstractSocket extends EventEmitter implements WritableSocketContract {
    protected port : number
    protected host : string
    protected socket? : Net.Socket
    protected heartbeat? : AbstractHeartbeatHandler
    protected shouldReconnect : boolean
    // protected readonly log : Logger

    protected constructor(host : string, port : number, shouldReconnect : boolean = true) {
        super()
        this.host            = host
        this.port            = port
        this.shouldReconnect = shouldReconnect
        // this.log             = getLogger([AbstractSocket.name, this.host, this.port])
    }

    public async connect() {
        // this.log.debug('Attempting to make a connection')

        return new Promise((res, rej) => {
            if (this.socket) {
                const message = 'Socket already exists'

                // this.log.error(message)

                return rej(new Error(message))
            }

            const timeout = setTimeout(() => {
                const message = 'Connection timeout reached'

                // this.log.error(message)

                rej(new TimeoutException(message))
            }, 1000)

            const socket = new Net.Socket()
                .connect({
                    port: this.port,
                    host: this.host
                })
                .on('connect', () => {
                    clearTimeout(timeout)
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
            // this.log.info('Forced a disconnection')
            this.shouldReconnect = false
            this.socket.end()
            this.socket = undefined
            this.heartbeat?.pause()
        }
    }

    public async write(data : Buffer) : Promise<void> {
        return new Promise((res, rej) => {
            if (!this.socket) {
                return rej(new Error(`Can't write, no socket connection established`))
            }

            this.socket.write(data, (error? : Error) => {
                this.restartHeartbeat()

                if (error) {
                    // this.log.error(`Data written with an error - ${ error.message }`)

                    return rej(error)
                }

                res()
            })
        })
    }

    protected async onDisconnect() {
        // this.log.debug('Connection closed')

        this.socket = undefined

        if (this.shouldReconnect) {
            // this.log.info('Automatically reconnecting', {shouldReconnect: this.shouldReconnect})
            return await this.connect()
        }

        // this.log.info('Not reconnecting', {shouldReconnect: this.shouldReconnect})
    }

    // @ts-ignore
    protected onError(error : Error) {
        this.shouldReconnect = false
        // this.log.error(`An error occurred - ${ error.message }`)
    }

    protected async onConnect(socket : Net.Socket) {
        // this.log.debug('Connection established')
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