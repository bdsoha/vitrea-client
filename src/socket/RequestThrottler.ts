import { Mutex }         from 'async-mutex'
import { LinearJitter }  from './LinearJitter'
import { SocketConfigs } from '../configs'


type OperationCallback<T> = ConstructorParameters<typeof Promise<T>>[0]

export class RequestThrottler {
    protected readonly mutex = new Mutex()
    protected readonly jitter: LinearJitter
    protected readonly log: SocketConfigs['log']

    constructor(configs: Pick<SocketConfigs, 'log' | 'requestBuffer' | 'requestBufferVariance'>) {
        this.jitter = new LinearJitter(configs.requestBuffer, configs.requestBufferVariance)
        this.log = configs.log
    }

    protected setTimeout(release: () => void, action: () => void) {
        setTimeout(() => {
            release()
            action()
        }, this.jitter.calculate())
    }

    protected async acquire(label: string) {
        this.log.debug('Waiting for mutex', { label })

        const release = await this.mutex.acquire()

        this.log.debug('Acquired mutex', { label })

        return async () => {
            release()

            this.log.debug('Released mutex', { label })
        }
    }

    async process<T>(label: string, callback: OperationCallback<T>): Promise<T> {
        const release = await this.acquire(label)

        return new Promise<T>((resolve, reject) => {
            try {
                callback(
                    (value: T) => this.setTimeout(release, () => resolve(value)),
                    (reason?: unknown) => this.setTimeout(release, () => reject(reason))
                )
            } catch (error) {
                this.setTimeout(release, () => reject(error))
            }
        })
    }
}
