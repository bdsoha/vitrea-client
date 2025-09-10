import { SocketConfigs }                          from '../configs'
import { RequestThrottler }                       from './RequestThrottler'
import { TimeoutException }                       from '../exceptions'
import pRetry, { AbortError, FailedAttemptError } from 'p-retry'

type OperationCallback<T> = ConstructorParameters<typeof Promise<T>>[0]

export class RequestRetryHandler {
    protected throttler: RequestThrottler
    protected maxRetries: number
    protected log: SocketConfigs['log']

    constructor(socketConfigs: SocketConfigs) {
        this.throttler = new RequestThrottler(socketConfigs)
        this.maxRetries = socketConfigs.maxRetries
        this.log = socketConfigs.log
    }

    protected onFailedAttempt(label: string) {
        return (error: FailedAttemptError) => {
            this.log.debug('Retry attempt', {
                label,
                attempt:     error.attemptNumber,
                retriesLeft: error.retriesLeft,
                error:       error.message
            })

            if (!(error instanceof TimeoutException)) {
                throw new AbortError(error.message)
            }
        }
    }

    public async processWithRetry<T>(label: string, callback: OperationCallback<T>): Promise<T> {
        return pRetry(
            () => this.throttler.process(label, callback),
            {
                retries:         this.maxRetries,
                minTimeout:      50,
                maxTimeout:      250,
                onFailedAttempt: this.onFailedAttempt(label)
            }
        )
    }
}
