import { Socket } from 'node:net'
import { TimeoutError } from 'p-timeout'
import * as Exceptions from './exceptions'
import { Requests, Responses } from './index'
import {
    FakeController,
    type Reply,
    ack,
    acknowledgeAll,
    frame,
    sleep,
    waitFor,
} from './testing/FakeController'
import {
    AckType,
    CommandID,
    KeyPowerStatus,
    type LoggerContract,
    ProtocolVersion,
    type SocketConfigs,
} from './types'
import { VitreaClient } from './VitreaClient'

const keyStatus = (messageID: number, nodeID: number, keyID: number) =>
    frame(CommandID.KeyStatus, messageID, [
        nodeID,
        keyID,
        0x4f,
        0,
        0,
        0,
        0x55,
        0,
    ])

const getLogger = (): LoggerContract => ({
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
})

describe('VitreaClient', () => {
    let controller: FakeController
    let client: VitreaClient

    const start = async (
        reply: Reply = acknowledgeAll,
        configs: Partial<SocketConfigs> = {},
        version: ProtocolVersion = ProtocolVersion.V2,
    ) => {
        controller = await FakeController.start(reply)
        client = VitreaClient.create(
            {
                host: '127.0.0.1',
                port: controller.port,
                username: 'admin',
                password: 'secret',
                version,
            },
            {
                heartbeatInterval: 60_000,
                maxRetries: 1,
                requestBuffer: 0,
                requestTimeout: 200,
                ...configs,
            },
        )

        await client.connect()
        await waitFor(() => controller.commands(0).includes(CommandID.Login))
    }

    const handshakeAnd =
        (reply: Reply): Reply =>
        received =>
            [
                CommandID.ToggleHeartbeat,
                CommandID.Login,
                CommandID.Heartbeat,
            ].includes(received.command as 0x07)
                ? acknowledgeAll(received)
                : reply(received)

    afterEach(() => {
        client?.disconnect()
        controller?.stop()
    })

    it('[connect] cannot overwrite an existing connection', async () => {
        await start()

        await expect(client.connect()).rejects.toBeInstanceOf(
            Exceptions.ConnectionExistsException,
        )
    })

    it('[connect] raises a timeout when the controller does not answer', async () => {
        const socket = new Socket()

        vi.spyOn(socket, 'connect').mockImplementation(() => socket)

        const silent = VitreaClient.create(
            { username: 'admin', password: 'secret' },
            { socketSupplier: () => socket, requestTimeout: 50 },
        )

        await expect(silent.connect()).rejects.toThrow(TimeoutError)
    })

    it('[handshake] toggles the heartbeat then logs in', async () => {
        await start()

        expect(controller.commands(0).slice(0, 2)).toStrictEqual([
            CommandID.ToggleHeartbeat,
            CommandID.Login,
        ])
    })

    it('[send] resolves with the reply that carries its message ID', async () => {
        await start(
            handshakeAnd(({ messageID }) => [
                frame(CommandID.NodeCount, messageID + 1, [1, 9]),
                frame(CommandID.NodeCount, messageID, [2, 7, 8]),
            ]),
        )

        const response = await client.send(new Requests.NodeCount())

        expect(response).toBeInstanceOf(Responses.NodeCount)
        expect(response.list).toStrictEqual([7, 8])
    })

    it('[send] ignores a status push for another key with the same message ID', async () => {
        await start(
            handshakeAnd(({ messageID }) => [
                keyStatus(messageID, 5, 2),
                keyStatus(messageID, 5, 1),
            ]),
        )

        const response = await client.send(new Requests.KeyStatus(5, 1))

        expect(response.keyID).toBe(1)
    })

    it('[send] resolves a node status request with a key status reply', async () => {
        await start(
            handshakeAnd(({ messageID }) => [keyStatus(messageID, 7, 0)]),
        )

        const response = await client.send(new Requests.NodeStatus(7))

        expect(response).toBeInstanceOf(Responses.KeyStatus)
        expect(response.nodeID).toBe(7)
    })

    it('[send] rejects a key status at once when V2 reports the node unavailable', async () => {
        await start(
            handshakeAnd(({ messageID }) => [
                ack(messageID, AckType.NOT_AVAILABLE),
            ]),
        )

        const started = Date.now()

        await expect(client.send(new Requests.KeyStatus(5, 1))).rejects.toThrow(
            'NOT_AVAILABLE',
        )
        expect(Date.now() - started).toBeLessThan(100)
    })

    it('[send] keeps waiting on a V1 key status NACK and rejects on ERROR', async () => {
        let replies = 0

        await start(
            handshakeAnd(({ messageID }) => [
                ack(messageID, replies++ === 0 ? AckType.NACK : AckType.ERROR),
            ]),
            {},
            ProtocolVersion.V1,
        )

        await expect(client.send(new Requests.KeyStatus(5, 1))).rejects.toThrow(
            'ERROR',
        )
        expect(replies).toBe(2)
    })

    it('[send] keeps waiting on a data read NACK and rejects on ERROR', async () => {
        let replies = 0

        await start(
            handshakeAnd(({ messageID }) => [
                ack(messageID, replies++ === 0 ? AckType.NACK : AckType.ERROR),
            ]),
        )

        await expect(
            client.send(new Requests.NodeCount()),
        ).rejects.toBeInstanceOf(Exceptions.RequestRejectedException)
        expect(replies).toBe(2)
    })

    it('[send] resends a request with the same message ID after a timeout', async () => {
        await start(handshakeAnd(() => []))

        await expect(client.send(new Requests.NodeCount())).rejects.toThrow(
            TimeoutError,
        )

        const resent = controller.received.filter(
            entry => entry.command === CommandID.NodeCount,
        )

        expect(resent).toHaveLength(2)
        expect(resent[0].messageID).toBe(resent[1].messageID)
    })

    it('[send] resolves an acknowledged command with the acknowledgement', async () => {
        await start()

        const response = await client.send(
            new Requests.ToggleKeyStatus(1, 2, KeyPowerStatus.ON),
        )

        expect(response).toBeInstanceOf(Responses.Acknowledgement)
        expect(response.isOK).toBeTruthy()
    })

    it('[send] rejects when there is no connection', async () => {
        await start()
        client.disconnect()

        await expect(
            client.send(new Requests.NodeCount()),
        ).rejects.toBeInstanceOf(Exceptions.NoConnectionException)
    })

    it('[onKeyStatus] receives every status push, split or joined', async () => {
        await start()

        const statuses: number[] = []

        client.onKeyStatus(status => statuses.push(status.keyID))

        const pushes = Buffer.concat([
            keyStatus(0x10, 3, 1),
            keyStatus(0x11, 3, 2),
        ])

        controller.push(0, pushes.subarray(0, 5))
        await sleep(10)
        controller.push(0, pushes.subarray(5))

        await waitFor(() => statuses.length === 2)

        expect(statuses).toStrictEqual([1, 2])
    })

    it('[handleFrame] emits an event for an unknown command', async () => {
        await start()

        const unknown = vi.fn()

        client.on('vitrea::data::unknown', unknown)
        controller.push(0, frame(0x99, 0x01))

        await waitFor(() => unknown.mock.calls.length === 1)
    })

    it('[create] redacts user credentials in the log', () => {
        const log = getLogger()

        VitreaClient.create({ username: 'admin', password: 'secret' }, { log })

        expect(log.debug).toHaveBeenCalledWith(
            'Client created',
            expect.objectContaining({
                connection: expect.objectContaining({
                    username: 'a***n',
                    password: 's***t',
                }),
            }),
        )
    })

    it('[log] logs requests at info with scope and host, and never the credentials', async () => {
        const log = getLogger()

        await start(acknowledgeAll, { log })
        await client.send(new Requests.NodeCount()).catch(() => {})

        expect(log.info).toHaveBeenCalledWith(
            'Request sent',
            expect.objectContaining({
                command: 'NodeCount',
                scope: 'client',
                host: '127.0.0.1',
            }),
        )

        const lines = JSON.stringify([
            vi.mocked(log.debug).mock.calls,
            vi.mocked(log.info).mock.calls,
        ])

        expect(lines).not.toContain('73:00:65:00:63:00')
        expect(lines).toContain('"data":"[redacted]"')
    })

    it('[log] logs heartbeats and acknowledgements at debug only', async () => {
        const log = getLogger()

        await start(acknowledgeAll, { log, heartbeatInterval: 20 })
        await waitFor(() =>
            controller.commands(0).includes(CommandID.Heartbeat),
        )
        await sleep(20)

        const commands = vi
            .mocked(log.info)
            .mock.calls.map(
                ([, meta]) => (meta as { command?: string }).command,
            )

        expect(commands).not.toContain('Heartbeat')
        expect(commands).not.toContain('Acknowledgement')
        expect(log.debug).toHaveBeenCalledWith(
            'Request sent',
            expect.objectContaining({ command: 'Heartbeat' }),
        )
    })
})
