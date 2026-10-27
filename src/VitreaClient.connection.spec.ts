import { Requests } from './index'
import {
    FakeController,
    type Reply,
    ack,
    acknowledgeAll,
    frame,
    sleep,
    waitFor,
} from './testing/FakeController'
import { AckType, CommandID, type SocketConfigs } from './types'
import { VitreaClient } from './VitreaClient'

describe('VitreaClient connection', () => {
    let controller: FakeController
    let client: VitreaClient

    const start = async (
        reply: Reply = acknowledgeAll,
        configs: Partial<SocketConfigs> = {},
    ) => {
        controller = await FakeController.start(reply)
        client = VitreaClient.create(
            {
                host: '127.0.0.1',
                port: controller.port,
                username: 'admin',
                password: 'secret',
            },
            {
                heartbeatInterval: 60_000,
                maxRetries: 1,
                requestBuffer: 0,
                requestTimeout: 100,
                ...configs,
            },
        )
    }

    afterEach(() => {
        client?.disconnect()
        controller?.stop()
    })

    it('[reconnect] reconnects and repeats the handshake after the controller closes', async () => {
        await start()

        const reconnected = vi.fn()

        client.onReconnect(reconnected)

        await client.connect()
        await waitFor(() => controller.commands(0).includes(CommandID.Login))

        controller.connections[0].end()

        await waitFor(() => reconnected.mock.calls.length === 1)

        expect(controller.commands(1).slice(0, 2)).toStrictEqual([
            CommandID.ToggleHeartbeat,
            CommandID.Login,
        ])
    })

    it('[reconnect] reconnects after the controller resets the connection', async () => {
        await start()

        const reconnected = vi.fn()

        client.onReconnect(reconnected)

        await client.connect()
        await waitFor(() => controller.commands(0).includes(CommandID.Login))

        controller.connections[0].resetAndDestroy()

        await waitFor(() => reconnected.mock.calls.length === 1)
    })

    it('[heartbeat] reconnects when heartbeats stop being answered', async () => {
        await start(
            received =>
                received.command === CommandID.Heartbeat
                && received.connection === 0
                    ? []
                    : acknowledgeAll(received),
            { heartbeatInterval: 20 },
        )

        const reconnected = vi.fn()

        client.onReconnect(reconnected)

        await client.connect()

        await waitFor(() => reconnected.mock.calls.length === 1)

        expect(controller.connections).toHaveLength(2)
    })

    it('[reconnect] backs off when the handshake keeps failing', async () => {
        await start(received =>
            received.connection === 0 ? acknowledgeAll(received) : [],
        )

        await client.connect()
        await waitFor(() => controller.commands(0).includes(CommandID.Login))

        controller.connections[0].end()

        await waitFor(() => controller.connections.length === 4, 5000)

        const [, first, second, third] = controller.connectedAt

        expect(second - first).toBeGreaterThanOrEqual(1000)
        expect(third - second).toBeGreaterThanOrEqual(2000)
    }, 10_000)

    it('[handshake] a drop mid-handshake logs in once on the new connection', async () => {
        await start(received =>
            received.connection === 0 && received.command === CommandID.Login
                ? []
                : acknowledgeAll(received),
        )

        const reconnected = vi.fn()

        client.onReconnect(reconnected)

        await client.connect()
        await waitFor(() => controller.commands(0).includes(CommandID.Login))

        controller.connections[0].end()

        await waitFor(() => controller.commands(1).includes(CommandID.Login))
        await sleep(300)

        const logins = controller
            .commands(1)
            .filter(command => command === CommandID.Login)

        expect(logins).toHaveLength(1)
        expect(controller.connections).toHaveLength(2)
    })

    it('[connect] rejects at once when the connection is refused and can be retried', async () => {
        await start()
        controller.stop()

        const started = Date.now()

        await expect(client.connect()).rejects.toThrow('ECONNREFUSED')
        expect(Date.now() - started).toBeLessThan(200)
        await expect(client.connect()).rejects.toThrow('ECONNREFUSED')
    })

    it('[handshake] reports a login that is not acknowledged and stays connected', async () => {
        await start(received =>
            received.command === CommandID.Login
                ? [ack(received.messageID, AckType.NACK)]
                : acknowledgeAll(received),
        )

        const failed = vi.fn()
        const reconnected = vi.fn()

        client.onLoginFailed(failed)
        client.onReconnect(reconnected)

        await client.connect()
        await waitFor(() => failed.mock.calls.length === 1)

        expect(failed.mock.calls[0][0].type).toBe(AckType.NACK)
        expect(controller.connections).toHaveLength(1)
        expect(reconnected).not.toHaveBeenCalled()
    })

    it('[disconnect] does not reconnect after an explicit disconnect', async () => {
        await start()

        await client.connect()
        client.disconnect()

        await sleep(200)

        expect(controller.connections).toHaveLength(1)
    })

    it('[disconnect] cancels a scheduled reconnect', async () => {
        await start(received =>
            received.connection === 0 ? acknowledgeAll(received) : [],
        )

        await client.connect()
        await waitFor(() => controller.commands(0).includes(CommandID.Login))

        controller.connections[0].end()

        await waitFor(() => controller.connections.length === 2)
        await sleep(250)

        client.disconnect()

        const connections = controller.connections.length

        await sleep(1500)

        expect(controller.connections).toHaveLength(connections)
    })

    it('[shouldReconnect] stays disabled after connecting', async () => {
        await start(acknowledgeAll, { shouldReconnect: false })

        await client.connect()
        controller.connections[0].end()

        await sleep(200)

        expect(controller.connections).toHaveLength(1)
    })

    it('[send] a request issued before a drop is answered on the new connection', async () => {
        await start(received => {
            if (received.command !== CommandID.NodeCount) {
                return acknowledgeAll(received)
            }

            return received.connection === 0
                ? []
                : [frame(CommandID.NodeCount, received.messageID, [1, 4])]
        })

        await client.connect()
        await waitFor(() => controller.commands(0).includes(CommandID.Login))

        const pending = client.send(new Requests.NodeCount())

        await waitFor(() =>
            controller.commands(0).includes(CommandID.NodeCount),
        )
        controller.connections[0].end()

        expect((await pending).list).toStrictEqual([4])
    })
})
