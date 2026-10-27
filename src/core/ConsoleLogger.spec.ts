import { ConsoleLogger } from './ConsoleLogger'

describe('ConsoleLogger', () => {
    const logger = new ConsoleLogger()

    beforeEach(() => {
        vi.spyOn(global.console, 'error').mockImplementation(() => {})
        vi.spyOn(global.console, 'warn').mockImplementation(() => {})
        vi.spyOn(global.console, 'info').mockImplementation(() => {})
        vi.spyOn(global.console, 'debug').mockImplementation(() => {})
    })

    it.each(['error', 'warn', 'info', 'debug'] as const)(
        '[%s] logs the message and meta using console',
        level => {
            logger[level]('Test message', { key: 'value' })

            expect(console[level]).toHaveBeenCalledWith('Test message', {
                key: 'value',
            })
        },
    )

    it('[info] logs an empty meta when none is given', () => {
        logger.info('Test message')

        expect(console.info).toHaveBeenCalledWith('Test message', {})
    })
})
