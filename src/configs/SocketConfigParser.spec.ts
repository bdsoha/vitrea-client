import * as Net from 'node:net'
import { ConsoleLogger, NullLogger } from '../core'
import { SocketConfigParser } from './SocketConfigParser'

describe('SocketConfigParser', () => {
    beforeEach(() => {
        vi.unstubAllEnvs()
    })

    it('[create] has default values', () => {
        const configs = SocketConfigParser.create()

        expect(configs.log).toBeInstanceOf(NullLogger)
        expect(configs.shouldReconnect).toBeTruthy()
        expect(configs.ignoreAckLogs).toBeFalsy()
        expect(configs.requestBuffer).toBe(250)
        expect(configs.requestTimeout).toBe(1000)
        expect(configs.heartbeatInterval).toBe(3000)
        expect(configs.maxRetries).toBe(3)
        expect(configs.socketSupplier).toBeInstanceOf(Function)
        expect(configs.socketSupplier()).toBeInstanceOf(Net.Socket)
    })

    it('[create] uses environment variables when available', () => {
        vi.stubEnv('VITREA_VBOX_REQUEST_BUFFER', '100')
        vi.stubEnv('VITREA_VBOX_REQUEST_TIMEOUT', '2000')
        vi.stubEnv('VITREA_VBOX_HEARTBEAT_INTERVAL', '5000')
        vi.stubEnv('VITREA_VBOX_IGNORE_ACK_LOGS', 'true')
        vi.stubEnv('VITREA_VBOX_SHOULD_RECONNECT', 'false')
        vi.stubEnv('VITREA_VBOX_MAX_RETRIES', '5')

        const configs = SocketConfigParser.create()

        expect(configs.shouldReconnect).toBeFalsy()
        expect(configs.ignoreAckLogs).toBeTruthy()
        expect(configs.requestBuffer).toBe(100)
        expect(configs.requestTimeout).toBe(2000)
        expect(configs.heartbeatInterval).toBe(5000)
        expect(configs.maxRetries).toBe(5)
    })

    it('[create] uses parameters when available', () => {
        const supplier = vi.fn()

        const configs = SocketConfigParser.create({
            socketSupplier: supplier,
            ignoreAckLogs: true,
            shouldReconnect: false,
            requestBuffer: 100,
            requestTimeout: 2000,
            heartbeatInterval: 7000,
            maxRetries: 5,
            log: new ConsoleLogger(),
        })

        expect(configs.log).toBeInstanceOf(ConsoleLogger)
        expect(configs.socketSupplier).toBe(supplier)
        expect(configs.ignoreAckLogs).toBeTruthy()
        expect(configs.shouldReconnect).toBeFalsy()
        expect(configs.requestBuffer).toBe(100)
        expect(configs.requestTimeout).toBe(2000)
        expect(configs.heartbeatInterval).toBe(7000)
        expect(configs.maxRetries).toBe(5)
    })
})
