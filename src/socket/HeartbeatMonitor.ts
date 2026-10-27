import type { ScopedLogger } from '../logging'

export class HeartbeatMonitor {
    protected timer?: NodeJS.Timeout
    protected summaryTimer?: NodeJS.Timeout
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
        this.schedule()
        this.summaryTimer = setInterval(
            () => this.summarize(),
            this.summaryInterval,
        )
        this.summaryTimer.unref()
    }

    public stop() {
        clearTimeout(this.timer)
        clearInterval(this.summaryTimer)
        this.timer = undefined
        this.summaryTimer = undefined
    }

    public countReconnect() {
        this.reconnects++
    }

    protected schedule() {
        this.timer = setTimeout(() => void this.tick(), this.interval)
        this.timer.unref()
    }

    protected async tick() {
        this.sent++

        try {
            await this.beat()
        } catch (error) {
            this.timer = undefined
            this.onFailure(error)

            return
        }

        this.acknowledged++
        this.lastAcknowledgedAt = Date.now()

        if (this.timer) {
            this.schedule()
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
