import { RoomMetaDataV2 } from './RoomMetaDataV2'


describe('RoomMetaDataV2', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3C, 0x1A, 0x00, 0x15, 0x1F, 0x00, 0x00, 0x10,
        0x45, 0x00, 0x6E, 0x00, 0x74, 0x00, 0x72, 0x00, 0x61, 0x00, 0x6E,
        0x00, 0x63, 0x00, 0x65, 0x00, 0xC9,
    ]

    it.todo('converts a buffer array to an object')
    //     const response = new RoomMetaDataV2(raw)

    //     expect(response).toHaveProperty('commandID', 0x1A)
    //     expect(response).toHaveProperty('id', 0x00)
    //     expect(response).toHaveProperty('name', 'Entrance')
    // })

    it('recieves a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new RoomMetaDataV2(buffer))
            .toStrictEqual(new RoomMetaDataV2(raw))
    })
})
