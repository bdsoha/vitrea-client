import { RequestThrottler } from './RequestThrottler'
import { LoggerContract }   from '../types'


describe('RequestThrottler', () => {
    vi.useFakeTimers()

    let throttler: RequestThrottler
    let logger: LoggerContract

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
        logger = getLogger()

        const socketConfigs = {
            requestBuffer:         250,
            requestBufferVariance: 0.15,
            log:                   logger,
        }

        throttler = new RequestThrottler(socketConfigs)
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.clearAllTimers()
    })

    it('resolves with correct value', async () => {
        const promise = throttler.process<string>('test', resolve => resolve('test-result'))

        await vi.runAllTimersAsync()
        expect(await promise).toBe('test-result')

        expect(logger.debug).toHaveBeenCalledWith('Acquired mutex', { label: 'test' })
        expect(logger.debug).toHaveBeenCalledWith('Releasing mutex', { label: 'test' })
    })

    it('rejects with correct error', async () => {
        const promise = throttler
            .process<string>('test', (_, reject) => reject(new Error('test-error')))
            .catch(error => error)

        await vi.runAllTimersAsync()

        const result = await promise
        expect(result).toBeInstanceOf(Error)
        expect((result as Error).message).toBe('test-error')
    })

    it('enforces sequential processing', async () => {
        const order: number[] = []

        const promises = [1, 2, 3].map(n =>
            throttler.process<number>('test', resolve => {
                order.push(n)
                resolve(n)
            })
        )

        await vi.runAllTimersAsync()
        await Promise.all(promises)

        expect(order).toEqual([1, 2, 3])
    })

    it('releases mutex after errors', async () => {
        const promise1 = throttler.process<string>('test', () => {
            throw new Error('error')
        }).catch(error => error)

        await vi.runAllTimersAsync()

        const result1 = await promise1
        expect(result1).toBeInstanceOf(Error)
        expect((result1 as Error).message).toBe('error')

        const promise2 = throttler.process<string>('test', resolve => {
            resolve('success')
        })

        await vi.runAllTimersAsync()
        expect(await promise2).toBe('success')
    })
})
