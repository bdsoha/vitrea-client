import { WritableSocketContract } from './WritableSocketContract'


export abstract class AbstractHeartbeatHandler {
    protected interval: number
    protected timer?: NodeJS.Timeout
    protected socket: WritableSocketContract

    protected constructor(interval: number, socket: WritableSocketContract) {
        this.interval = interval
        this.socket = socket
    }

    public get isPaused(): boolean{
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
        await this.socket.write(this.getHeartbeatDataGram())

        this.restart()
    }

    protected abstract getHeartbeatDataGram(): Buffer
}
