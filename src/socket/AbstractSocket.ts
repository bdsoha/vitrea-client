import { Timeout }                    from './Timeout'
import { EventEmitter }               from 'events'
import { WritableSocketContract }     from './WritableSocketContract'
import { AbstractHeartbeatHandler }   from './AbstractHeartbeatHandler'
import { LoggerContract, NullLogger } from '../core'
import * as Net                       from 'net'
import * as Exceptions                from '../exceptions'


export type SocketConfigs = Partial<{
    log: LoggerContract,
    socketSupplier: () => Net.Socket,
    shouldReconnect: boolean
    requestTimeout: number
}>

export abstract class AbstractSocket extends EventEmitter implements WritableSocketContract {
    protected socket?: Net.Socket
    protected heartbeat?: AbstractHeartbeatHandler
    protected shouldReconnect: boolean
    protected readonly socketSupplier?: SocketConfigs['socketSupplier']
    protected readonly log: LoggerContract
    protected readonly requestTimeout: number

    protected constructor(
        protected readonly host: string,
        protected readonly port: number,
        {
            log = new NullLogger(),
            socketSupplier = undefined,
            shouldReconnect = true,
            requestTimeout = 1000
        }: SocketConfigs = {}
    ) {
        super()
        this.socketSupplier = socketSupplier
        this.log = log
        this.shouldReconnect = shouldReconnect
        this.requestTimeout = requestTimeout
    }

    protected createNewSocket(): Net.Socket {
        this.socket = this.socketSupplier
            ? this.socketSupplier()
            : new Net.Socket()

        return this.socket
            .on('connect', this.handleConnect.bind(this))
            .on('data', this.handleData.bind(this))
            .on('end', this.handleDisconnect.bind(this))
            .on('error', this.handleError.bind(this))
    }

    public async connect() :Promise<void> {
        this.log.debug('Attempting to make a connection')

        if (this.socket) {
            const error = new Exceptions.ConnectionExistsException()

            this.log.error(error.message)

            throw error
        }

        return new Promise(res => {
            const timeout = Timeout.create(this.requestTimeout)

            this.createNewSocket()
                .on('connect', () => {
                    timeout.stop()
                    res(null)
                })
                .connect({
                    port: this.port,
                    host: this.host
                })
        })
    }

    public disconnect() {
        if (this.socket) {
            this.log.info('Forced a disconnection')
            this.heartbeat?.pause()
            this.shouldReconnect = false
            this.socket.end()
            this.socket = undefined
        }
    }

    public async write(data: Buffer): Promise<void> {
        if (!this.socket) {
            throw new Exceptions.NoConnectionException()
        }

        return new Promise((res, rej) => {
            this.socket.write(data, (error?: Error) => {
                this.restartHeartbeat()

                if (error) {
                    this.log.error(`Data written with an error - ${error.message}`)

                    return rej(error)
                }

                res()
            })
        })
    }

    protected async handleDisconnect() {
        this.log.debug('Connection closed')

        this.socket = undefined

        if (this.shouldReconnect) {
            this.log.info('Automatically reconnecting', { shouldReconnect: this.shouldReconnect })

            return await this.connect()
        }

        this.log.info('Not reconnecting', { shouldReconnect: this.shouldReconnect })
    }

    protected handleError(error: Error) {
        this.shouldReconnect = false
        this.log.error(`An error occurred - ${error.message}`)
    }

    protected async handleConnect() {
        this.log.debug('Connection established')

        this.shouldReconnect = true

        this.restartHeartbeat()
    }

    protected restartHeartbeat() {
        this.heartbeat?.restart()
    }

    protected abstract handleData(data: Buffer): void

    protected abstract handleUnknownData(data: Buffer): void
}
