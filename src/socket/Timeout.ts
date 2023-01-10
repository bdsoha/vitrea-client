import { TimeoutException } from './TimeoutException'


type TimeoutConfig = Partial<{
    message: string,
    onTimeout: (error?: TimeoutException) => void
}>

export class Timeout {
    protected timer?: NodeJS.Timeout

    public constructor(
        protected interval: number,
        protected message: string,
        protected onTimeout: TimeoutConfig['onTimeout']
    ) { }

    public start() {
        this.timer = setTimeout(() => {
            const error = new TimeoutException(this.message)

            this.onTimeout(error)

            throw error
        },
            this.interval
        )
    }

    public stop() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    public static create(interval: number, configs: TimeoutConfig = {}) {
        const instance = new this(
            interval,
            configs.message ?? `Timeout reached after [${interval}] milliseconds`,
            configs.onTimeout ?? (_e => undefined) // eslint-disable-line
        )

        instance.start()

        return instance
    }
}
