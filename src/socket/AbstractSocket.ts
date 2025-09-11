import { EventEmitter }                                         from 'node:events'
import { AbstractHeartbeatHandler }                             from './AbstractHeartbeatHandler'
import { BaseRequest, BaseResponse }                            from '../core'
import { RequestSenderContract, SocketConfigs, LoggerContract } from '../types'
import pTimeout                                                 from 'p-timeout'
import * as Exceptions                                          from '../exceptions'


export abstract class AbstractSocket extends EventEmitter implements RequestSenderContract {
    protected socket?: ReturnType<SocketConfigs['socketSupplier']>
    protected heartbeat?: AbstractHeartbeatHandler
    protected readonly log: LoggerContract

    protected constructor(
        protected readonly host: string,
        protected readonly port: number,
        protected readonly socketConfigs: SocketConfigs,
    ) {
        super()
        this.log = socketConfigs.log
        this.setMaxListeners(60)
    }

    protected createNewSocket(): ReturnType<SocketConfigs['socketSupplier']> {
        this.socket = this.socketConfigs.socketSupplier()

        return this.socket
            .setNoDelay(true)
            .on('connect', this.handleConnect.bind(this))
            .on('data', this.handleData.bind(this))
            .on('end', this.handleDisconnect.bind(this))
            .on('error', this.handleError.bind(this))
    }

    public async connect(): Promise<void> {
        this.log.debug('Attempting to make a connection')

        if (this.socket) {
            const error = new Exceptions.ConnectionExistsException()

            this.log.error(error.message)

            throw error
        }

        return await pTimeout(
            new Promise<void>(res => {
                this.createNewSocket()
                    .on('connect', () => res(null))
                    .connect({
                        port: this.port,
                        host: this.host
                    })
            }),
            { milliseconds: this.socketConfigs.requestTimeout }
        )
    }

    public disconnect() {
        if (this.socket) {
            this.log.info('Forced a disconnection')
            this.heartbeat?.pause()
            this.socketConfigs.shouldReconnect = false
            this.socket.end()
            this.socket = undefined
        }
    }

    public async write(data: Buffer): Promise<void> {
        if (!this.socket || this.socket.destroyed) {
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

        if (this.socketConfigs.shouldReconnect) {
            this.log.info('Automatically reconnecting', { shouldReconnect: this.socketConfigs.shouldReconnect })

            return await this.connect()
        }

        this.log.info('Not reconnecting', { shouldReconnect: this.socketConfigs.shouldReconnect })
    }

    protected handleError(error: Error) {
        this.socketConfigs.shouldReconnect = false

        this.log.error(`An error occurred - ${error.message}`)
    }

    protected async handleConnect() {
        this.log.debug('Connection established')

        this.socketConfigs.shouldReconnect = true

        this.restartHeartbeat()
    }

    protected restartHeartbeat() {
        this.heartbeat?.restart()
    }

    protected abstract handleData(data: Buffer): void

    protected abstract handleUnknownData(data: Buffer): void

    public abstract send<T extends BaseRequest>(request: T): Promise<BaseResponse>
}
