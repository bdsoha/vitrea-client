import type { ScopedLogger } from '../logging'

export class HeartbeatMonitor {
    protected timer?: NodeJS.Timeout
    protected summaryTimer?: NodeJS.Timeout
    protected epoch = 0
    protected sent = 0
    protected acknowledged = 0
    protected reconnects = 0
    protected lastAcknowledgedAt?: number
    protected connectedAt?: number

    public constructor(
        protected readonly interval: number,
        protected readonly beat: () => Promise<unknown>,
        protected readonly onFailure: (error: unknown) => void,
        protected readonly log: ScopedLogger,
        protected readonly summaryInterval = 300_000,
    ) {}

    public start() {
        this.stop()
        this.connectedAt = Date.now()
        this.schedule(this.epoch)

        if (!this.summaryTimer) {
            this.summaryTimer = setInterval(
                () => this.summarize(),
                this.summaryInterval,
            )
            this.summaryTimer.unref()
        }
    }

    public stop() {
        this.epoch++
        clearTimeout(this.timer)
        this.timer = undefined
    }

    public dispose() {
        this.stop()
        clearInterval(this.summaryTimer)
        this.summaryTimer = undefined
    }

    public countReconnect() {
        this.reconnects++
    }

    protected schedule(epoch: number) {
        this.timer = setTimeout(() => void this.tick(epoch), this.interval)
        this.timer.unref()
    }

    protected async tick(epoch: number) {
        this.sent++

        try {
            await this.beat()
        } catch (error) {
            if (epoch === this.epoch) {
                this.timer = undefined
                this.onFailure(error)
            }

            return
        }

        this.acknowledged++
        this.lastAcknowledgedAt = Date.now()

        if (epoch === this.epoch) {
            this.schedule(epoch)
        }
    }

    protected summarize() {
        const now = Date.now()

        this.log.info('Heartbeat summary', {
            sent: this.sent,
            acknowledged: this.acknowledged,
            lastAcknowledgedMs:
                this.lastAcknowledgedAt === undefined
                    ? null
                    : now - this.lastAcknowledgedAt,
            connectedMs:
                this.connectedAt === undefined ? null : now - this.connectedAt,
            reconnects: this.reconnects,
        })
    }
}
