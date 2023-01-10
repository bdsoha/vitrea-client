import { MessageID } from '../utilities/MessageID'
import { NodeCount } from './NodeCount'


describe('NodeCount', () => {
    it('requests the amount of available nodes', () => {
        MessageID.setNextID(51)

        const command = new NodeCount()

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x24, 0x00, 0x02, 0x33, 0x96
        ]))
    })
})
