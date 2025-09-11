import { BaseRequest }           from '../core'
import { RequestSenderContract } from '../types'


export abstract class AbstractHeartbeatHandler {
    protected interval: number
    protected timer?: NodeJS.Timeout
    protected socket: RequestSenderContract

    protected constructor(interval: number, socket: RequestSenderContract) {
        this.interval = interval
        this.socket = socket
    }

    public get isPaused(): boolean {
        return !this.timer
    }

    public pause() {
        if (!this.isPaused) {
            clearTimeout(this.timer)
            this.timer = null
        }
    }

    public restart() {
        this.pause()

        this.timer = setTimeout(
            this.handleHeartbeat.bind(this),
            this.interval
        )
    }

    protected async handleHeartbeat() {
        await this.socket.send(this.getHeartbeatRequest())

        this.restart()
    }

    protected abstract getHeartbeatRequest<T extends BaseRequest>(): T
}
