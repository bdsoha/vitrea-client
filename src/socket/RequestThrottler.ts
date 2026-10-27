import pLimit from 'p-limit'
import type { SocketConfigs } from '../types'
import { LinearJitter } from './LinearJitter'

export class RequestThrottler {
    protected readonly jitter: LinearJitter
    protected readonly limit = pLimit(1)

    constructor(
        configs: Pick<SocketConfigs, 'requestBuffer' | 'requestBufferVariance'>,
    ) {
        this.jitter = new LinearJitter(
            configs.requestBuffer,
            configs.requestBufferVariance,
        )
    }

    protected delay(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms))
    }

    public process<T>(task: () => Promise<T>): Promise<T> {
        return this.limit(async () => {
            try {
                return await task()
            } finally {
                await this.delay(this.jitter.calculate())
            }
        })
    }
}
