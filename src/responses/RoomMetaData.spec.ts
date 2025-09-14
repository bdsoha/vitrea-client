import { RoomMetaData } from './RoomMetaData'

describe('RoomMetaData', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3c, 0x1a, 0x00, 0x15, 0x1f, 0x00, 0x00, 0x10, 0x45,
        0x00, 0x6e, 0x00, 0x74, 0x00, 0x72, 0x00, 0x61, 0x00, 0x6e, 0x00, 0x63,
        0x00, 0x65, 0x00, 0xc9,
    ]

    const hebrewRoomName = [
        0x56, 0x54, 0x55, 0x3c, 0x1a, 0x00, 0x0f, 0x06, 0x01, 0x00, 0x0a, 0xde,
        0x05, 0xd8, 0x05, 0xd1, 0x05, 0xd7, 0x05, 0x20, 0x00,
    ]

    it('converts a buffer array to an object', () => {
        const response = new RoomMetaData(raw)

        expect(response).toHaveProperty('commandID', 0x1a)
        expect(response).toHaveProperty('id', 0x00)
        expect(response).toHaveProperty('name', 'Entrance')
    })

    it('receives a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new RoomMetaData(buffer)).toStrictEqual(new RoomMetaData(raw))
    })

    it('displays room names in Hebrew', () => {
        const response = new RoomMetaData(hebrewRoomName)

        expect(response).toHaveProperty('commandID', 0x1a)
        expect(response).toHaveProperty('name', 'מטבח')
    })
})
