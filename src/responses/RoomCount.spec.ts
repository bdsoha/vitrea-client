import { RoomCount } from './RoomCount'

describe('RoomCount', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3c, 0x1d, 0x00, 0x0b, 0x1e, 0x08, 0x00, 0x01, 0x02,
        0x03, 0x04, 0x05, 0x06, 0x07, 0xa5,
    ]

    it('converts a buffer array to an object', () => {
        const response = new RoomCount(raw)

        expect(response).toHaveProperty('commandID', 0x1d)
        expect(response).toHaveProperty('total', 0x08)
        expect(response).toHaveProperty(
            'list',
            [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07],
        )
    })

    it('receives a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new RoomCount(buffer)).toStrictEqual(new RoomCount(raw))
    })
})
