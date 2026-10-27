import { Requests, Responses } from '../index'
import { ack, frame } from '../testing/FakeController'
import { AckType, CommandID, ProtocolVersion } from '../types'
import { PendingRequests } from './PendingRequests'

describe('PendingRequests', () => {
    const keyStatus = (messageID: number, nodeID: number, keyID: number) =>
        new Responses.KeyStatus(
            frame(CommandID.KeyStatus, messageID, [
                nodeID,
                keyID,
                0x4f,
                0,
                0,
                0,
                0,
                0,
            ]),
        )

    const acknowledgement = (messageID: number, type: AckType) =>
        new Responses.Acknowledgement(ack(messageID, type))

    it('[settle] resolves a request with the reply that matches it', async () => {
        const pending = new PendingRequests(ProtocolVersion.V2)
        const request = new Requests.KeyStatus(5, 1).withMessageID(0x10)
        const reply = pending.wait(request)

        pending.settle(keyStatus(0x10, 5, 2))
        pending.settle(keyStatus(0x11, 5, 1))
        pending.settle(keyStatus(0x10, 5, 1))

        expect((await reply).keyID).toBe(1)
    })

    it.each([
        [ProtocolVersion.V1, AckType.NACK, false],
        [ProtocolVersion.V1, AckType.ERROR, true],
        [ProtocolVersion.V2, AckType.NOT_AVAILABLE, true],
        [ProtocolVersion.V2, AckType.NACK, true],
    ])(
        '[settle] a %s key status %s acknowledgement rejects: %s',
        async (version, type, rejects) => {
            const pending = new PendingRequests(version)
            const request = new Requests.KeyStatus(5, 1).withMessageID(0x20)
            const settled = vi.fn()

            pending.wait(request).then(settled, settled)
            pending.settle(acknowledgement(0x20, type))
            await Promise.resolve()

            expect(settled.mock.calls.length === 1).toBe(rejects)
        },
    )

    it.each([
        [AckType.NACK, false],
        [AckType.IN_USE, false],
        [AckType.NOT_AVAILABLE, false],
        [AckType.ERROR, true],
    ])(
        '[settle] a data read %s acknowledgement rejects: %s',
        async (type, rejects) => {
            const pending = new PendingRequests(ProtocolVersion.V2)
            const request = new Requests.NodeCount().withMessageID(0x30)
            const settled = vi.fn()

            pending.wait(request).then(settled, settled)
            pending.settle(acknowledgement(0x30, type))
            await Promise.resolve()

            expect(settled.mock.calls.length === 1).toBe(rejects)
        },
    )

    it('[settle] resolves an acknowledged command on any acknowledgement', async () => {
        const pending = new PendingRequests(ProtocolVersion.V2)
        const request = new Requests.Login('user', 'pass').withMessageID(0x40)
        const reply = pending.wait(request)

        pending.settle(acknowledgement(0x40, AckType.NACK))

        expect((await reply).type).toBe(AckType.NACK)
    })

    it('[forget] ignores replies to a forgotten request', async () => {
        const pending = new PendingRequests(ProtocolVersion.V2)
        const request = new Requests.NodeCount().withMessageID(0x50)
        const settled = vi.fn()

        pending.wait(request).then(settled, settled)
        pending.forget(request)
        pending.settle(
            new Responses.NodeCount(frame(CommandID.NodeCount, 0x50, [0])),
        )
        await Promise.resolve()

        expect(settled).not.toHaveBeenCalled()
    })
})
