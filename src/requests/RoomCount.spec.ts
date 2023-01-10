import { MessageID } from '../utilities/MessageID'
import { RoomCount } from './RoomCount'


describe('RoomCount', () => {
    it('requests the metadata for a node', () => {
        MessageID.setNextID(29)

        const command = new RoomCount()

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x1D, 0x00, 0x02, 0x1D, 0x79
        ]))
    })
})
