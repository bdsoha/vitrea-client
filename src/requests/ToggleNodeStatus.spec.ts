import { ToggleNodeStatus }                    from './ToggleNodeStatus'
import { MessageID }                           from '../utilities/MessageID'
import { LEDBackgroundBrightness, LockStatus } from '../utilities/Enums'


describe('ToggleNodeStatus', () => {
    beforeEach(() => MessageID.setNextID(121))

    it('builds command with node, lock status, and LED level parameters', () => {
        const command = new ToggleNodeStatus(11, LockStatus.UNLOCKED, LEDBackgroundBrightness.NORMAL)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x1E, 0x00, 0x05, 0x79,
            0x0B, 0x00, 0x02, 0xE6
        ]))
    })

    it('builds command with different parameters', () => {
        const command = new ToggleNodeStatus(5, LockStatus.LOCKED, LEDBackgroundBrightness.MAX)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x1E, 0x00, 0x05, 0x79,
            0x05, 0x01, 0x04, 0xE3
        ]))
    })

    it('sets LED to off', () => {
        const command = new ToggleNodeStatus(1, LockStatus.UNLOCKED, LEDBackgroundBrightness.OFF)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x1E, 0x00, 0x05, 0x79,
            0x01, 0x00, 0x00, 0xDA
        ]))
    })

    it('[eventName] uses the Acknowledgement event name', () => {
        const command = new ToggleNodeStatus(11, LockStatus.UNLOCKED, LEDBackgroundBrightness.NORMAL)

        expect(command).toHaveProperty('eventName', 'data::00-79')
    })
})
