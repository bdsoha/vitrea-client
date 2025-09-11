import { MessageID }  from '../utilities/MessageID'
import { NodeStatus } from './NodeStatus'


describe('NodeStatus', () => {
    it('requests the node status', () => {
        MessageID.setNextID(121)

        const command = new NodeStatus(1)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x23, 0x00, 0x04, 0x79, 0x01, 0x00, 0xDE
        ]))
    })
})
