import { NodeCount } from './NodeCount'

describe('NodeCount', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3c, 0x24, 0x00, 0x12, 0x3b, 0x0f, 0x01, 0x02, 0x03,
        0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0d, 0x0e, 0x0f, 0x10,
        0x37,
    ]

    it('converts a buffer array to an object', () => {
        const response = new NodeCount(raw)

        expect(response).toHaveProperty('commandID', 0x24)
        expect(response).toHaveProperty('total', 0x0f)
        expect(response).toHaveProperty(
            'list',
            [
                0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a,
                0x0b, 0x0d, 0x0e, 0x0f, 0x10,
            ],
        )
    })

    it('receives a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new NodeCount(buffer)).toStrictEqual(new NodeCount(raw))
    })

    it('[logData] retrieve data to log', () => {
        const dataGram = new NodeCount(raw)

        expect(dataGram.logData).toStrictEqual({
            command: 'NodeCount',
            commandID: '0x24',
            direction: 'Incoming',
            messageID: '0x3B',
            hasValidChecksum: true,
            total: 15,
            list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16],
            raw: '56:54:55:3C:24:00:12:3B:0F:01:02:03:04:05:06:07:08:09:0A:0B:0D:0E:0F:10',
        })
    })
})
