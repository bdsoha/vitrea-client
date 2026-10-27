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

    it('[start] a restart while a beat is in flight keeps a single loop', async () => {
        const hanging: Array<() => void> = []
        const beat = vi.fn(async () => {
            if (beat.mock.calls.length === 1) {
                await new Promise<void>(resolve => hanging.push(resolve))
            }
        })
        const monitor = new HeartbeatMonitor(
            100,
            beat,
            vi.fn(),
            new ScopedLogger(getLogger()),
        )

        monitor.start()
        await vi.advanceTimersByTimeAsync(100)
        monitor.start()
        hanging[0]()
        await vi.advanceTimersByTimeAsync(1000)
        monitor.dispose()

        expect(beat).toHaveBeenCalledTimes(11)
    })

    it('[start] ignores the failure of a beat from before a restart', async () => {
        const onFailure = vi.fn()
        const failing: Array<(error: Error) => void> = []
        const beat = vi.fn(async () => {
            if (beat.mock.calls.length === 1) {
                await new Promise<void>((_, reject) => failing.push(reject))
            }
        })
        const monitor = new HeartbeatMonitor(
            100,
            beat,
            onFailure,
            new ScopedLogger(getLogger()),
        )

        monitor.start()
        await vi.advanceTimersByTimeAsync(100)
        monitor.start()
        failing[0](new Error('No socket connection established'))
        await vi.advanceTimersByTimeAsync(300)
        monitor.dispose()

        expect(onFailure).not.toHaveBeenCalled()
        expect(beat).toHaveBeenCalledTimes(4)
    })

    it('[summarize] keeps its interval across restarts', async () => {
        const logger = getLogger()
        const monitor = new HeartbeatMonitor(
            100,
            async () => {},
            vi.fn(),
            new ScopedLogger(logger),
            1000,
        )

        monitor.start()

        for (let i = 0; i < 4; i++) {
            await vi.advanceTimersByTimeAsync(400)
            monitor.stop()
            monitor.start()
        }

        monitor.dispose()

        expect(logger.info).toHaveBeenCalledTimes(1)
    })
})
