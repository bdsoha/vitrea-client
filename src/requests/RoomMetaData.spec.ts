import { MessageID }    from '../utilities/MessageID'
import { RoomMetaData } from './RoomMetaData'


describe('RoomMetaData', () => {
    it('requests the metadata for a node', () => {
        MessageID.setNextID(30)

        const command = new RoomMetaData(0)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x1A, 0x00, 0x03, 0x1E, 0x00, 0x78
        ]))
    })
})
