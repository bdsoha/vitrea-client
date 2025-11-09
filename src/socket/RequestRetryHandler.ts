import pRetry, { AbortError, type RetryContext } from 'p-retry'
import { TimeoutError } from 'p-timeout'
import type { PromiseExecutor, SocketConfigs } from '../types'
import { RequestThrottler } from './RequestThrottler'

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
        return ({ error, attemptNumber, retriesLeft }: RetryContext) => {
            this.log.warn('Retry attempt', {
                label,
                attempt: attemptNumber,
                retriesLeft: retriesLeft,
                error: error.message,
            })

            if (!(error instanceof TimeoutError)) {
                throw new AbortError(error.message)
            }
        }
    }

    public async processWithRetry<T>(
        label: string,
        callback: PromiseExecutor<T>,
    ): Promise<T> {
        return pRetry(() => this.throttler.process(label, callback), {
            retries: this.maxRetries,
            minTimeout: 50,
            maxTimeout: 250,
            onFailedAttempt: this.onFailedAttempt(label),
        })
    }
}
