import { EventEmitter } from 'node:events'
import type * as Net from 'node:net'
import { pEvent } from 'p-event'
import pTimeout from 'p-timeout'
import * as Exceptions from '../exceptions'
import type { ScopedLogger } from '../logging'
import type { SocketConfigs } from '../types'
import { FrameDecoder } from '../utilities/FrameDecoder'

type ConnectionEvents = {
    open: [generation: number]
    frame: [frame: Buffer]
    close: []
}

export class Connection extends EventEmitter<ConnectionEvents> {
    protected socket?: Net.Socket
    protected decoder = new FrameDecoder()
    protected closing = false
    protected failures = 0
    protected reconnectTimer?: NodeJS.Timeout
    protected currentGeneration = 0

    public constructor(
        protected readonly host: string,
        protected readonly port: number,
        protected readonly configs: Pick<
            SocketConfigs,
            'requestTimeout' | 'shouldReconnect' | 'socketSupplier'
        >,
        protected readonly log: ScopedLogger,
    ) {
        super()
    }

    public get generation(): number {
        return this.currentGeneration
    }

    public async connect(): Promise<void> {
        if (this.socket) {
            throw new Exceptions.ConnectionExistsException()
        }

        this.closing = false
        this.cancelReconnect()

        const socket = this.createSocket()
        const connected = pEvent(socket, 'connect')

        socket.connect({ port: this.port, host: this.host })

        try {
            await pTimeout(connected, {
                milliseconds: this.configs.requestTimeout,
            })
        } catch (error) {
            this.socket = undefined
            socket.destroy()

            throw error
        }

        this.currentGeneration++
        this.log.info('Connection opened', { generation: this.generation })
        this.emit('open', this.generation)
    }

    public disconnect() {
        this.closing = true
        this.cancelReconnect()

        const { socket } = this

        if (socket) {
            this.log.info('Connection closed by client')
            this.socket = undefined
            socket.end()
        }
    }

    public async write(data: Buffer): Promise<void> {
        const { socket } = this

        if (!socket || socket.destroyed) {
            throw new Exceptions.NoConnectionException()
        }

        await new Promise<void>((resolve, reject) => {
            socket.write(data, error => (error ? reject(error) : resolve()))
        })
    }

    public fail(generation: number, reason: string) {
        if (generation !== this.generation || !this.socket) {
            return
        }

        this.log.warn('Connection dropped', { reason })
        this.socket.destroy()
    }

    public markHealthy(generation: number) {
        if (generation === this.generation && this.socket) {
            this.failures = 0
        }
    }

    protected createSocket(): Net.Socket {
        const socket = this.configs.socketSupplier()

        this.socket = socket
        this.decoder = new FrameDecoder()

        return socket
            .setNoDelay(true)
            .on('data', data => this.handleData(data))
            .on('close', () => this.handleClose(socket))
            .on('error', error => this.log.error('Socket error', { error }))
    }

    protected handleData(data: Buffer) {
        for (const frame of this.decoder.push(data)) {
            this.emit('frame', frame)
        }
    }

    protected handleClose(socket: Net.Socket) {
        if (socket !== this.socket) {
            return
        }

        this.socket = undefined
        this.log.info('Connection closed', { generation: this.generation })
        this.emit('close')

        if (this.configs.shouldReconnect && !this.closing) {
            this.scheduleReconnect()
        }
    }

    protected scheduleReconnect() {
        const delay =
            this.failures === 0
                ? 0
                : Math.min(1000 * 2 ** (this.failures - 1), 30_000)

        this.failures++
        this.log.info('Reconnect scheduled', { attempt: this.failures, delay })
        this.reconnectTimer = setTimeout(() => void this.reconnect(), delay)
    }

    protected cancelReconnect() {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = undefined
    }

    protected async reconnect() {
        this.reconnectTimer = undefined

        if (this.closing || this.socket) {
            return
        }

        try {
            await this.connect()
        } catch (error) {
            this.log.warn('Reconnect failed', { error })
            this.scheduleReconnect()
        }
    }
}
