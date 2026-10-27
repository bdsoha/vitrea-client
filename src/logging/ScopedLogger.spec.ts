import { Requests } from '../index'
import type { LoggerContract } from '../types'
import { ScopedLogger } from './ScopedLogger'

describe('ScopedLogger', () => {
    const getLogger = (): LoggerContract => ({
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        debug: vi.fn(),
    })

    it('[child] adds its scope to the parent context', () => {
        const logger = getLogger()

        new ScopedLogger(logger, { host: 'vbox' })
            .child('socket')
            .info('Opened', {
                generation: 1,
            })

        expect(logger.info).toHaveBeenCalledWith('Opened', {
            host: 'vbox',
            scope: 'socket',
            generation: 1,
        })
    })

    it('[error] logs an error as its message', () => {
        const logger = getLogger()

        new ScopedLogger(logger).error('Failed', { error: new Error('boom') })

        expect(logger.error).toHaveBeenCalledWith('Failed', { error: 'boom' })
    })

    it('[traffic] logs a datagram at its own level', () => {
        const logger = getLogger()
        const scoped = new ScopedLogger(logger)

        scoped.traffic('Request sent', new Requests.Heartbeat())
        scoped.traffic('Request sent', new Requests.NodeCount())

        expect(logger.debug).toHaveBeenCalledWith(
            'Request sent',
            expect.objectContaining({ command: 'Heartbeat' }),
        )
        expect(logger.info).toHaveBeenCalledWith(
            'Request sent',
            expect.objectContaining({ command: 'NodeCount' }),
        )
    })
})
