import { MessageID } from '../utilities/MessageID'
import { InternalUnitStatuses } from './InternalUnitStatuses'


describe('InternalUnitStatuses', () => {
    it('requests the status for internal units', () => {
        MessageID.setNextID(51)

        const command = new InternalUnitStatuses()

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x60, 0x00, 0x02, 0x33, 0xD2
        ]))
    })
})
