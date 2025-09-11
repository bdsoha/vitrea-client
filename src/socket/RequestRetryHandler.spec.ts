import { AbortError }                    from 'p-retry'
import { TimeoutError }                  from 'p-timeout'
import { RequestThrottler }              from './RequestThrottler'
import { RequestRetryHandler }           from './RequestRetryHandler'
import { SocketConfigs, LoggerContract } from '../types'


describe('RequestRetryHandler', () => {
    vi.useFakeTimers()

    let handler: RequestRetryHandler
    let mockThrottler: RequestThrottler
    let mockLogger: LoggerContract

    const getLogger = (): LoggerContract => {
        return {
            log:   vi.fn(),
            error: vi.fn(),
            warn:  vi.fn(),
            info:  vi.fn(),
            debug: vi.fn(),
        }
    }

    beforeEach(() => {
        mockLogger = getLogger()

        const socketConfigs = {
            log:                   mockLogger,
            maxRetries:            3,
            requestBuffer:         250,
            requestBufferVariance: 0.15,
        } as SocketConfigs

        handler = new RequestRetryHandler(socketConfigs)
        mockThrottler = handler['throttler']

        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.clearAllTimers()
    })

    it('[processWithRetry] resolves successfully on first attempt', async () => {
        const testValue = 'success'
        const callback = vi.fn((resolve) => resolve(testValue))

        vi.spyOn(mockThrottler, 'process').mockResolvedValue(testValue)

        const result = await handler.processWithRetry('test-label', callback)

        expect(result).toBe(testValue)
        expect(mockThrottler.process).toHaveBeenCalledWith('test-label', callback)
    })

    it('[processWithRetry] aborts immediately on non-TimeoutError', async () => {
        const nonTimeoutError = new Error('Not a timeout')
        const callback = vi.fn()

        vi.spyOn(mockThrottler, 'process').mockRejectedValue(nonTimeoutError)

        await expect(handler.processWithRetry('test-label', callback)).rejects.toThrow(AbortError)
        expect(mockThrottler.process).toHaveBeenCalledTimes(1)
        expect(mockLogger.warn).toHaveBeenCalledTimes(1)
    })

    it('[onFailedAttempt] logs retry attempt information for TimeoutError', () => {
        const failedAttemptError = Object.assign(new TimeoutError(), {
            attemptNumber: 2,
            retriesLeft:   1,
            message:       'Timeout occurred'
        })

        const onFailedAttempt = handler['onFailedAttempt']('test-label')

        expect(() => onFailedAttempt(failedAttemptError)).not.toThrow()

        expect(mockLogger.warn).toHaveBeenCalledWith('Retry attempt', {
            label:       'test-label',
            attempt:     2,
            retriesLeft: 1,
            error:       'Timeout occurred'
        })
    })

    it('[onFailedAttempt] throws AbortError for non-TimeoutError', () => {
        const failedAttemptError = Object.assign(new Error('Connection refused'), {
            attemptNumber: 1,
            retriesLeft:   2
        })

        const onFailedAttempt = handler['onFailedAttempt']('test-label')

        expect(() => onFailedAttempt(failedAttemptError)).toThrow(AbortError)
        expect(mockLogger.warn).toHaveBeenCalledWith('Retry attempt', {
            label:       'test-label',
            attempt:     1,
            retriesLeft: 2,
            error:       'Connection refused'
        })
    })

    it('[processWithRetry] uses correct retry configuration', async () => {
        const callback = vi.fn((resolve) => resolve('test'))

        vi.spyOn(mockThrottler, 'process').mockResolvedValue('test')

        const result = await handler.processWithRetry('test-label', callback)

        expect(result).toBe('test')
        expect(mockThrottler.process).toHaveBeenCalledWith('test-label', callback)
    })
})
