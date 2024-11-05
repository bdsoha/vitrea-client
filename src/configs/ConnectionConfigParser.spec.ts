import { ConnectionConfigParser, ProtocolVersion } from './ConnectionConfigParser'


describe('ConnectionConfigParser', () => {
    const env = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...env }
    })

    afterEach(() => process.env = env)

    it('[create] uses environment variables when available', () => {
        process.env.VITREA_VBOX_HOST = '192.168.1.111'
        process.env.VITREA_VBOX_PORT = '1234'
        process.env.VITREA_VBOX_USERNAME = 'admin'
        process.env.VITREA_VBOX_PASSWORD = 'secret'
        process.env.VITREA_VBOX_VERSION = 'v1'

        const client = ConnectionConfigParser.create()

        expect(client).toStrictEqual({
            host:     '192.168.1.111',
            port:     1234,
            username: 'admin',
            password: 'secret',
            version:  ProtocolVersion.V1
        })
    })

    it('[create] uses parameters when available', () => {
        const client = ConnectionConfigParser.create({
            host:     '192.168.1.111',
            port:     1234,
            username: 'admin',
            password: 'secret',
            version:  'v1'
        })

        expect(client).toStrictEqual({
            host:     '192.168.1.111',
            port:     1234,
            username: 'admin',
            password: 'secret',
            version:  'v1'
        })
    })

    it('[create] uses a default port and host', () => {
        const client = ConnectionConfigParser.create({
            username: 'admin',
            password: 'secret'
        })

        expect(client).toStrictEqual({
            host:     '192.168.1.23',
            port:     11501,
            username: 'admin',
            password: 'secret',
            version:  ProtocolVersion.V2
        })
    })

    it('[create] raises an exception for missing host', () => {
        const callback = () => ConnectionConfigParser.create({
            host:     '',
            username: 'admin',
            password: 'secret'
        })

        expect(callback).toThrow(TypeError)
    })

    it('[create] raises an exception for missing username', () => {
        const callback = () => ConnectionConfigParser.create({ password: 'secret' })

        expect(callback).toThrow(TypeError)
    })

    it('[create] raises an exception for missing password', () => {
        const callback = () => ConnectionConfigParser.create({ username: 'admin' })

        expect(callback).toThrow(TypeError)
    })
})
