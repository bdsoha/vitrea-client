import { VBoxConnection }  from './VBoxConnection'
import { ProtocolVersion } from './ProtocolVersion'


describe('VBoxConnection', () => {
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

        const client = VBoxConnection.create()

        expect(client).toStrictEqual({
            host:     '192.168.1.111',
            port:     1234,
            username: 'admin',
            password: 'secret',
            version:  ProtocolVersion.V1
        })
    })

    it('[create] uses parameters when available', () => {
        const client = VBoxConnection.create({
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
        const client = VBoxConnection.create({
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
        const callback = () => VBoxConnection.create({
             host:     '',
             username: 'admin',
             password: 'secret'
        })

        expect(callback).toThrow(TypeError)
    })

    it('[create] raises an exception for missing username', () => {
        const callback = () => VBoxConnection.create({ password: 'secret' })

        expect(callback).toThrow(TypeError)
    })

    it('[create] raises an exception for missing password', () => {
        const callback = () => VBoxConnection.create({ username: 'admin' })

        expect(callback).toThrow(TypeError)
    })
})
