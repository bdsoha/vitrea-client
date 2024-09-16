import { Socket }                    from 'net'
import { KeyStatus, RoomMetaData }   from './responses'
import { VitreaClient }              from './VitreaClient'
import { SocketConfigs }             from './socket/AbstractSocket'
import * as Exceptions               from './exceptions'
import { Login, ToggleHeartbeat }    from './requests'
import { BaseRequest, BaseResponse } from './core'

describe('VitreaClient', () => {
    jest.useFakeTimers()

    const getClient = (configs?: SocketConfigs) => {
        return VitreaClient.create({
            username: 'admin',
            password: 'secret'
        }, configs)
    }

    it('[connect] cannot overwrite an existing connection', async () => {
        const client = getClient()

        // @ts-ignore
        client.socket = 'any non-null value'

        await expect(() => client.connect()).rejects.toBeInstanceOf(
            Exceptions.ConnectionExistsException
        )
    })

    it('[connect] timeout is raised within 1s', () => {
        expect.assertions(1)

        const socket = new Socket()

        jest.spyOn(socket, 'connect').mockImplementation(() => socket)

        const client = getClient({ socketSupplier: () => socket })

        client.connect()

        try {
            jest.runAllTimers()
        } catch (e) {
            expect(e).toBeInstanceOf(Exceptions.TimeoutException)
        }
    })

    it('[handleConnect] sends login and heartbeat requests', async () => {
        expect.assertions(2)

        const socket = new Socket()

        const client = getClient({ socketSupplier: () => socket })

        jest.spyOn(client, 'send').mockImplementationOnce(async (request: BaseRequest) => {
            expect(request).toBeInstanceOf(ToggleHeartbeat)
            return undefined
        })

        jest.spyOn(client, 'send').mockImplementationOnce(async (request: BaseRequest) => {
            expect(request).toBeInstanceOf(Login)
            return undefined
        })

        // @ts-ignore
        client.createNewSocket()

        socket.emit('connect')
    })

    it('[write] cannot write to a disconnected socket', async () => {
        const buffer = Buffer.from([])

        await expect(getClient().write(buffer)).rejects.toBeInstanceOf(
            Exceptions.NoConnectionException
        )
    })

    it('[handleDisconnect] will attempt to reconnect by default', async () => {
        const socket = new Socket()

        const mock = jest.spyOn(socket, 'connect').mockImplementation(() => socket)

        const client = getClient({ socketSupplier: () => socket })

        // @ts-ignore
        client.createNewSocket()

        expect(mock).not.toHaveBeenCalled()

        socket.emit('end')

        expect(mock).toHaveBeenCalledTimes(1)
    })

    it('[handleDisconnect] will not attempt to reconnect by default', async () => {
        const socket = new Socket()

        const mock = jest.spyOn(socket, 'connect')

        const client = getClient({ shouldReconnect: false, socketSupplier: () => socket })

        // @ts-ignore
        client.createNewSocket()

        socket.emit('end')

        expect(mock).not.toHaveBeenCalled()
    })

    it('[handleData] will fire an event for received buffer', async () => {
        expect.assertions(2)

        const raw = [
            0x56, 0x54, 0x55, 0x3C, 0x1A, 0x00, 0x15, 0x1F, 0x00, 0x00, 0x10,
            0x45, 0x00, 0x6E, 0x00, 0x74, 0x00, 0x72, 0x00, 0x61, 0x00, 0x6E,
            0x00, 0x63, 0x00, 0x65, 0x00, 0xC9,
        ]

        const buffer = Buffer.from([...raw, ...raw])

        const socket = new Socket()

        const client = getClient({ socketSupplier: () => socket })

        // @ts-ignore
        client.createNewSocket()

        client.addListener('data::1a-1f', (response: BaseResponse) => {
            expect(response).toBeInstanceOf(RoomMetaData)
        })

        socket.emit('data', buffer)
    })

    it('[handleUnknownData] will fire an event for unknown buffer', async () => {
        expect.assertions(1)

        const buffer = Buffer.from([1, 2, 3, 4])

        const socket = new Socket()

        const client = getClient({ socketSupplier: () => socket })

        // @ts-ignore
        client.createNewSocket()

        client.addListener('vitrea::data::unknown', (response: Buffer) => {
            expect(response).toBeInstanceOf(Buffer)
        })

        socket.emit('data', buffer)
    })

    it('[disconnect] will not attempt to reconnect when explicitly disconnected', async () => {
        const socket = new Socket()

        const mock = jest.spyOn(socket, 'connect')

        const client = getClient({ socketSupplier: () => socket })

        // @ts-ignore
        client.createNewSocket()

        client.disconnect()

        expect(mock).not.toHaveBeenCalled()
    })

    it('[onKeyStatus] can register a listener for key status changes', () => {
        const client = getClient()

        const mock = jest.fn()

        client.onKeyStatus(mock)

        const status = new KeyStatus([
            0x56, 0x54, 0x55, 0x3C, 0x29, 0x00, 0x0A, 0x48, 0x01, 0x00, 0x46,
            0x00, 0x00, 0x00, 0x41, 0x00, 0x3E,
        ])

        client.emit('vitrea::status::update', status)

        expect(mock).toHaveBeenCalledTimes(1)
        expect(mock).toHaveBeenCalledWith(status)
    })
})
