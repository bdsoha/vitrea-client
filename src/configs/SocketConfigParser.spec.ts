import { SocketConfigParser }        from './SocketConfigParser'
import { ConsoleLogger, NullLogger } from '../core'


describe('SocketConfigParser', () => {
    const env = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...env }
    })

    afterEach(() => process.env = env)

    it('[create] has default values', () => {
        const configs = SocketConfigParser.create()

        expect(configs.log).toBeInstanceOf(NullLogger)
        expect(configs.socketSupplier).toBeInstanceOf(Function)
        expect(configs.shouldReconnect).toBeTruthy()
        expect(configs.requestBuffer).toBe(250)
        expect(configs.requestTimeout).toBe(1000)
    })

    it('[create] uses environment variables when available', () => {
        process.env.VITREA_VBOX_REQUEST_BUFFER = '100'
        process.env.VITREA_VBOX_REQUEST_TIMEOUT = '2000'
        process.env.VITREA_VBOX_SHOULD_RECONNECT = 'false'

        const configs = SocketConfigParser.create()

        expect(configs.shouldReconnect).toBeFalsy()
        expect(configs.requestBuffer).toBe(100)
        expect(configs.requestTimeout).toBe(2000)
    })

    it('[create] uses parameters when available', () => {
        const supplier = jest.fn()

        const configs = SocketConfigParser.create({
            socketSupplier:  supplier,
            shouldReconnect: false,
            requestBuffer:   100,
            requestTimeout:  2000,
            log:             new ConsoleLogger()
        })

        expect(configs.log).toBeInstanceOf(ConsoleLogger)
        expect(configs.socketSupplier).toBe(supplier)
        expect(configs.shouldReconnect).toBeFalsy()
        expect(configs.requestBuffer).toBe(100)
        expect(configs.requestTimeout).toBe(2000)
    })
})
