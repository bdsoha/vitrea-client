import { ConsoleLogger } from './ConsoleLogger'

describe('ConsoleLogger', () => {
    const logger = new ConsoleLogger()

    beforeEach(() => {
        jest.spyOn(global.console, 'log').mockImplementation()
        jest.spyOn(global.console, 'error').mockImplementation()
        jest.spyOn(global.console, 'warn').mockImplementation()
        jest.spyOn(global.console, 'info').mockImplementation()
        jest.spyOn(global.console, 'debug').mockImplementation()
    })

    afterEach(() => jest.clearAllMocks())

    it('[log] logs using console', () => {
        logger.log('Test log message', 'any')

        expect(console.log).toHaveBeenCalledWith('Test log message', { level: 'any' })
    })

    it('[error] logs using console', () => {
        logger.error('Test error message', 'arg1', 'arg2')

        expect(console.error).toHaveBeenCalledWith('Test error message', 'arg1', 'arg2')
    })

    it('[warn] logs using console', () => {
        logger.warn('Test warn message', 'arg1', 'arg2')

        expect(console.warn).toHaveBeenCalledWith('Test warn message', 'arg1', 'arg2')
    })

    it('[info] logs using console', () => {
        logger.info('Test info message', 'arg1', 'arg2')

        expect(console.info).toHaveBeenCalledWith('Test info message', 'arg1', 'arg2')
    })

    it('[debug] logs using console', () => {
        logger.debug('Test debug message', 'arg1', 'arg2')

        expect(console.debug).toHaveBeenCalledWith('Test debug message', 'arg1', 'arg2')
    })
})
