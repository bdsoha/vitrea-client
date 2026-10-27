import {
    type AddressInfo,
    type Server,
    type Socket,
    createServer,
} from 'node:net'
import { pEvent } from 'p-event'
import { AckType } from '../types'

export type Received = {
    connection: number
    command: number
    messageID: number
    data: number[]
}

export type Reply = (received: Received) => Buffer[]

export const frame = (
    command: number,
    messageID: number,
    data: number[] = [],
) => {
    const length = data.length + 2
    const bytes = [
        0x56,
        0x54,
        0x55,
        0x3c,
        command,
        length >> 8,
        length & 0xff,
        messageID,
        ...data,
    ]

    return Buffer.from([
        ...bytes,
        bytes.reduce((sum, byte) => (sum + byte) & 0xff, 0),
    ])
}

export const ack = (messageID: number, type: AckType = AckType.ACK) =>
    frame(0x00, messageID, [type])

export const acknowledgeAll: Reply = ({ messageID }) => [ack(messageID)]

export class FakeController {
    public readonly connections: Socket[] = []
    public readonly received: Received[] = []
    public readonly connectedAt: number[] = []
    protected readonly server: Server = createServer()

    protected constructor(protected reply: Reply) {
        this.server.on('connection', socket => this.accept(socket))
    }

    public static async start(reply: Reply = acknowledgeAll) {
        const controller = new FakeController(reply)

        controller.server.listen(0, '127.0.0.1')
        await pEvent(controller.server, 'listening')

        return controller
    }

    public get port(): number {
        return (this.server.address() as AddressInfo).port
    }

    public commands(connection: number): number[] {
        return this.received
            .filter(entry => entry.connection === connection)
            .map(entry => entry.command)
    }

    public push(connection: number, data: Buffer) {
        this.connections[connection]?.write(data)
    }

    public stop() {
        for (const socket of this.connections) {
            socket.destroy()
        }

        this.server.close()
    }

    protected accept(socket: Socket) {
        const connection = this.connections.push(socket) - 1

        this.connectedAt.push(Date.now())

        socket.on('error', () => {})
        socket.on('data', data => {
            for (
                let i = 0;
                i + 7 < data.length;
                i += 7 + data.readUInt16BE(i + 5)
            ) {
                const length = data.readUInt16BE(i + 5)
                const received = {
                    connection,
                    command: data[i + 4],
                    messageID: data[i + 7],
                    data: [...data.subarray(i + 8, i + 6 + length)],
                }

                this.received.push(received)

                for (const response of this.reply(received)) {
                    socket.write(response)
                }
            }
        })
    }
}

export const waitFor = async (condition: () => boolean, timeout = 3000) => {
    const start = Date.now()

    while (!condition()) {
        if (Date.now() - start > timeout) {
            throw new Error('Condition not met in time')
        }

        await new Promise(resolve => setTimeout(resolve, 5))
    }
}

export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))
