import pLimit            from 'p-limit'
import { LinearJitter }  from './LinearJitter'
import { SocketConfigs } from '../configs'


type OperationCallback<T> = ConstructorParameters<typeof Promise<T>>[0]

export class RequestThrottler {
    protected readonly jitter: LinearJitter
    protected readonly log: SocketConfigs['log']
    protected readonly limit = pLimit(1)

    constructor(configs: Pick<SocketConfigs, 'log' | 'requestBuffer' | 'requestBufferVariance'>) {
        this.jitter = new LinearJitter(configs.requestBuffer, configs.requestBufferVariance)
        this.log = configs.log
    }

    protected setTimeout(action: () => void) {
        setTimeout(() => {
            action()
        }, this.jitter.calculate())
    }

    async process<T>(label: string, callback: OperationCallback<T>): Promise<T> {
        return this.limit(() => {
            this.log.debug('Acquired mutex', { label })

            return new Promise<T>((resolve, reject) => {
                try {
                    callback(
                        (value: T) => this.setTimeout(() => {
                            this.log.debug('Releasing mutex', { label })
                            resolve(value)
                        }),
                        (reason?: unknown) => this.setTimeout(() => {
                            this.log.debug('Releasing mutex', { label })
                            reject(reason)
                        })
                    )
                } catch (error) {
                    this.setTimeout(() => {
                        this.log.debug('Releasing mutex', { label })
                        reject(error)
                    })
                }
            })
        })
    }
}
