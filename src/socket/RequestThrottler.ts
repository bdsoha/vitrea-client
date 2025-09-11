import pLimit                             from 'p-limit'
import { LinearJitter }                   from './LinearJitter'
import { SocketConfigs, PromiseExecutor } from '../types'


export class RequestThrottler {
    protected readonly jitter: LinearJitter
    protected readonly log: SocketConfigs['log']
    protected readonly limit = pLimit(1)

    constructor(configs: Pick<SocketConfigs, 'log' | 'requestBuffer' | 'requestBufferVariance'>) {
        this.jitter = new LinearJitter(configs.requestBuffer, configs.requestBufferVariance)
        this.log = configs.log
    }

    protected delay(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms))
    }

    async process<T>(label: string, executor: PromiseExecutor<T>): Promise<T> {
        return this.limit(async () => {
            this.log.debug('Acquired mutex', { label })

            try {
                return await new Promise<T>((resolve, reject) => {
                    try {
                        executor(resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            } finally {
                await this.delay(this.jitter.calculate())

                this.log.debug('Releasing mutex', { label })
            }
        })
    }
}
