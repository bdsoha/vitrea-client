import { RequestThrottler } from './RequestThrottler'

describe('RequestThrottler', () => {
    vi.useFakeTimers()

    let throttler: RequestThrottler

    beforeEach(() => {
        throttler = new RequestThrottler({
            requestBuffer: 250,
            requestBufferVariance: 0.15,
        })
    })

    afterEach(() => {
        vi.clearAllTimers()
    })

    it('resolves with the task result', async () => {
        const promise = throttler.process(async () => 'test-result')

        await vi.runAllTimersAsync()

        expect(await promise).toBe('test-result')
    })

    it('rejects with the task error', async () => {
        const promise = throttler
            .process(async () => {
                throw new Error('test-error')
            })
            .catch(error => error)

        await vi.runAllTimersAsync()

        expect(((await promise) as Error).message).toBe('test-error')
    })

    it('enforces sequential processing', async () => {
        const order: string[] = []

        const promises = [1, 2, 3].map(n =>
            throttler.process(async () => {
                order.push(`start ${n}`)
                await new Promise(resolve => setTimeout(resolve, 10))
                order.push(`end ${n}`)
            }),
        )

        await vi.runAllTimersAsync()
        await Promise.all(promises)

        expect(order).toEqual([
            'start 1',
            'end 1',
            'start 2',
            'end 2',
            'start 3',
            'end 3',
        ])
    })

    it('waits the request buffer before releasing', async () => {
        const second = vi.fn(async () => {})

        void throttler.process(async () => {})
        void throttler.process(second)

        await vi.advanceTimersByTimeAsync(200)
        expect(second).not.toHaveBeenCalled()

        await vi.advanceTimersByTimeAsync(100)
        expect(second).toHaveBeenCalled()
    })
})
