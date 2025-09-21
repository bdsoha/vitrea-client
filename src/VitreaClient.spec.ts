import { Socket } from 'node:net'
import { TimeoutError } from 'p-timeout'
import type { BaseRequest, BaseResponse } from './core'
import * as Exceptions from './exceptions'
import { Login, NodeCount, ToggleHeartbeat } from './requests'
import {
    KeyStatus,
    NodeCount as NodeCountResponse,
    RoomMetaData,
} from './responses'
import type { LoggerContract, SocketConfigs } from './types'
import { MessageID } from './utilities/MessageID'
import { VitreaClient } from './VitreaClient'

describe('VitreaClient', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    const getClient = (configs?: Partial<SocketConfigs>) => {
        return VitreaClient.create(
            {
                username: 'admin',
                password: 'secret',
            },
            configs,
        )
    }

    const getLogger = (): LoggerContract => {
        return {
            log: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
            info: vi.fn(),
            debug: vi.fn(),
        }
    }

    it('[connect] cannot overwrite an existing connection', async () => {
        const client = getClient()

        // @ts-expect-error
        client.socket = 'any non-null value'

        await expect(() => client.connect()).rejects.toBeInstanceOf(
            Exceptions.ConnectionExistsException,
        )
    })

    it('[connect] timeout is raised within 1s', async () => {
        const socket = new Socket()

        vi.spyOn(socket, 'connect').mockImplementation(() => socket)

        const client = getClient({
            socketSupplier: () => socket,
            requestTimeout: 1000,
        })

        const promise = client.connect()

        vi.runAllTimers()

        await expect(promise).rejects.toThrow(TimeoutError)
    })

    it('[handleConnect] sends login and heartbeat requests', async () => {
        expect.assertions(2)

        const socket = new Socket()

        const client = getClient({ socketSupplier: () => socket })

        vi.spyOn(client, 'send').mockImplementationOnce(
            async (request: BaseRequest) => {
                expect(request).toBeInstanceOf(ToggleHeartbeat)
                return undefined
            },
        )

        vi.spyOn(client, 'send').mockImplementationOnce(
            async (request: BaseRequest) => {
                expect(request).toBeInstanceOf(Login)
                return undefined
            },
        )

        // @ts-expect-error
        client.createNewSocket()

        socket.emit('connect')
    })

    it('[write] cannot write to a disconnected socket', async () => {
        const buffer = Buffer.from([])

        await expect(getClient().write(buffer)).rejects.toBeInstanceOf(
            Exceptions.NoConnectionException,
        )
    })

    it('[handleDisconnect] will attempt to reconnect by default', async () => {
        const socket = new Socket()

        const mock = vi
            .spyOn(socket, 'connect')
            .mockImplementation(() => socket)

        const client = getClient({ socketSupplier: () => socket })

        // @ts-expect-error
        client.createNewSocket()

        expect(mock).not.toHaveBeenCalled()

        socket.emit('end')

        expect(mock).toHaveBeenCalledTimes(1)
    })

    it('[handleDisconnect] will not attempt to reconnect', async () => {
        const socket = new Socket()

        const mock = vi.spyOn(socket, 'connect')

        const client = getClient({
            shouldReconnect: false,
            socketSupplier: () => socket,
        })

        // @ts-expect-error
        client.createNewSocket()

        socket.emit('end')

        expect(mock).not.toHaveBeenCalled()
    })

    it('[handleData] will fire an event for received buffer', async () => {
        expect.assertions(2)

        const raw = [
            0x56, 0x54, 0x55, 0x3c, 0x1a, 0x00, 0x15, 0x1f, 0x00, 0x00, 0x10,
            0x45, 0x00, 0x6e, 0x00, 0x74, 0x00, 0x72, 0x00, 0x61, 0x00, 0x6e,
            0x00, 0x63, 0x00, 0x65, 0x00, 0xc9,
        ]

        const buffer = Buffer.from([...raw, ...raw])

        const socket = new Socket()

        const client = getClient({ socketSupplier: () => socket })

        // @ts-expect-error
        client.createNewSocket()

        client.addListener('data::1a-1f', (response: BaseResponse) => {
            expect(response).toBeInstanceOf(RoomMetaData)
        })

        socket.emit('data', buffer)
    })

    it('[handleData] can ignore Ack logs', async () => {
        const ack = [0x56, 0x54, 0x55, 0x3c, 0x00, 0x00, 0x03, 0x00, 0x00, 0x3e]

        const generic = [
            0x56, 0x54, 0x55, 0x3c, 0xc8, 0x00, 0x0e, 0x64, 0x03, 0xff, 0x00,
            0x0d, 0x6f, 0x00, 0x16, 0x17, 0x09, 0x54, 0x7d,
        ]

        const notAck = [
            0x56, 0x54, 0x55, 0x3c, 0x1a, 0x00, 0x15, 0x1f, 0x00, 0x00, 0x10,
            0x45, 0x00, 0x6e, 0x00, 0x74, 0x00, 0x72, 0x00, 0x61, 0x00, 0x6e,
            0x00, 0x63, 0x00, 0x65, 0x00, 0xc9,
        ]

        const socket = new Socket()

        const mock = getLogger()

        const client = getClient({
            socketSupplier: () => socket,
            log: mock,
            ignoreAckLogs: true,
        })

        // @ts-expect-error
        client.createNewSocket()

        socket.emit('data', Buffer.from(ack))

        expect(mock.info).toHaveBeenCalledTimes(0)

        socket.emit('data', Buffer.from(generic))

        expect(mock.info).toHaveBeenCalledTimes(0)

        socket.emit('data', Buffer.from(notAck))

        expect(mock.info).toHaveBeenCalledTimes(1)
    })

    it('[handleUnknownData] will fire an event for unknown buffer', async () => {
        expect.assertions(1)

        const buffer = Buffer.from([1, 2, 3, 4])

        const socket = new Socket()

        const client = getClient({ socketSupplier: () => socket })

        // @ts-expect-error
        client.createNewSocket()

        client.addListener('vitrea::data::unknown', (response: Buffer) => {
            expect(response).toBeInstanceOf(Buffer)
        })

        socket.emit('data', buffer)
    })

    it('[disconnect] will not attempt to reconnect when explicitly disconnected', async () => {
        const socket = new Socket()

        const mock = vi.spyOn(socket, 'connect')

        const client = getClient({ socketSupplier: () => socket })

        // @ts-expect-error
        client.createNewSocket()

        client.disconnect()

        expect(mock).not.toHaveBeenCalled()
    })

    it('[onKeyStatus] can register a listener for key status changes', () => {
        const client = getClient()

        const mock = vi.fn()

        client.onKeyStatus(mock)

        const status = new KeyStatus([
            0x56, 0x54, 0x55, 0x3c, 0x29, 0x00, 0x0a, 0x48, 0x01, 0x00, 0x46,
            0x00, 0x00, 0x00, 0x41, 0x00, 0x3e,
        ])

        client.emit('vitrea::status::update', status)

        expect(mock).toHaveBeenCalledTimes(1)
        expect(mock).toHaveBeenCalledWith(status)
    })

    it('[create] redact user credentials in log', () => {
        const mock = getLogger()

        getClient({ log: mock })

        expect(mock.debug).toHaveBeenCalledTimes(1)
        expect(mock.debug).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                connection: {
                    host: '192.168.1.23',
                    username: 'a***n',
                    password: 's***t',
                    port: 11501,
                    version: 'v2',
                },
            }),
        )
    })

    it('[send] successfully sends request and receives response', async () => {
        vi.useRealTimers()

        const socket = new Socket()
        const client = getClient({ socketSupplier: () => socket })

        vi.spyOn(socket, 'write').mockImplementation(() => true)

        // @ts-expect-error
        client.createNewSocket()

        MessageID.setNextID(0x3b)

        const requestPromise = client.send(new NodeCount())

        const responseBuffer = Buffer.from([
            0x56, 0x54, 0x55, 0x3c, 0x24, 0x00, 0x12, 0x3b, 0x0f, 0x01, 0x02,
            0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0d, 0x0e,
            0x0f, 0x10, 0x37,
        ])

        setImmediate(() => socket.emit('data', responseBuffer))

        const response = await requestPromise

        expect(response).toBeInstanceOf(NodeCountResponse)
        expect((response as NodeCountResponse).messageID).toBe(0x3b)
    })
})
