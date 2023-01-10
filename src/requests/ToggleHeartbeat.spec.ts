import { MessageID }       from '../utilities/MessageID'
import { ToggleHeartbeat } from './ToggleHeartbeat'


describe('ToggleHeartbeat', () => {
    beforeEach(() => MessageID.resetID())

    it('is set to `enabled` and `unsolicited` by default', () => {
        const command = new ToggleHeartbeat()

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x08, 0x00, 0x04, 0x01, 0x01, 0x01, 0x4C
        ]))
    })

    it('can set `enabled` and `unsolicited` to false', () => {
        const command = new ToggleHeartbeat(false, false)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x08, 0x00, 0x04, 0x01, 0x00, 0x00, 0x4A
        ]))
    })
})
