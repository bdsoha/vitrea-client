import { ScopedLogger } from '../logging'
import type { LoggerContract } from '../types'
import { HeartbeatMonitor } from './HeartbeatMonitor'

describe('HeartbeatMonitor', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    const getLogger = (): LoggerContract => ({
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
    })

    it('[start] beats on every interval after the previous beat', async () => {
        const beat = vi.fn(async () => {})
        const monitor = new HeartbeatMonitor(
            100,
            beat,
            vi.fn(),
            new ScopedLogger(getLogger()),
        )

        monitor.start()
        await vi.advanceTimersByTimeAsync(350)
        monitor.stop()

        expect(beat).toHaveBeenCalledTimes(3)
    })

    it('[start] reports a failed beat and stops', async () => {
        const onFailure = vi.fn()
        const beat = vi.fn(async () => {
            throw new Error('timeout')
        })
        const monitor = new HeartbeatMonitor(
            100,
            beat,
            onFailure,
            new ScopedLogger(getLogger()),
        )

        monitor.start()
        await vi.advanceTimersByTimeAsync(500)

        expect(onFailure).toHaveBeenCalledTimes(1)
        expect(beat).toHaveBeenCalledTimes(1)
    })

    it('[summarize] logs a summary at info on its own interval', async () => {
        const logger = getLogger()
        const monitor = new HeartbeatMonitor(
            100,
            async () => {},
            vi.fn(),
            new ScopedLogger(logger),
            1050,
        )

        monitor.start()
        monitor.countReconnect()
        await vi.advanceTimersByTimeAsync(1050)
        monitor.stop()

        expect(logger.info).toHaveBeenCalledWith(
            'Heartbeat summary',
            expect.objectContaining({
                sent: 10,
                acknowledged: 10,
                reconnects: 1,
            }),
        )
    })
})
