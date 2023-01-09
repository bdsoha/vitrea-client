import { WritableSocketContract } from './WritableSocketContract'


export abstract class AbstractHeartbeatHandler {
    protected interval: number
    protected timer?: NodeJS.Timeout
    protected socket: WritableSocketContract

    protected constructor(interval: number, socket: WritableSocketContract) {
        this.interval = interval
        this.socket = socket
    }

    public pause() {
        if (this.timer) {
            clearTimeout(this.timer)
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
