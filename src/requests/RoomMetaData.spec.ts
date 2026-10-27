import { RoomMetaData } from './RoomMetaData'

describe('RoomMetaData', () => {
    it('requests the metadata for a node', () => {
        const command = new RoomMetaData(0).withMessageID(30)

        expect(command.build()).toStrictEqual(
            Buffer.from([
                0x56, 0x54, 0x55, 0x3e, 0x1a, 0x00, 0x03, 0x1e, 0x00, 0x78,
            ]),
        )
    })
})
