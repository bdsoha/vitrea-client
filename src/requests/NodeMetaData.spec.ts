import { MessageID }    from '../utilities/MessageID'
import { NodeMetaData } from './NodeMetaData'


describe('NodeMetaData', () => {
    it('requests the metadata for a node', () => {
        MessageID.setNextID(52)

        const command = new NodeMetaData(1)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x1F, 0x00, 0x03, 0x34, 0x01, 0x94
        ]))
    })
})
