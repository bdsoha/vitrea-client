import { LEDBackgroundBrightness, LockStatus } from '../types'
import { ToggleNodeStatus } from './ToggleNodeStatus'

describe('ToggleNodeStatus', () => {
    it('builds command with node, lock status, and LED level parameters', () => {
        const command = new ToggleNodeStatus(
            11,
            LockStatus.UNLOCKED,
            LEDBackgroundBrightness.NORMAL,
        ).withMessageID(121)

        expect(command.build()).toStrictEqual(
            Buffer.from([
                0x56, 0x54, 0x55, 0x3e, 0x1e, 0x00, 0x05, 0x79, 0x0b, 0x00,
                0x02, 0xe6,
            ]),
        )
    })

    it('builds command with different parameters', () => {
        const command = new ToggleNodeStatus(
            5,
            LockStatus.LOCKED,
            LEDBackgroundBrightness.MAX,
        ).withMessageID(121)

        expect(command.build()).toStrictEqual(
            Buffer.from([
                0x56, 0x54, 0x55, 0x3e, 0x1e, 0x00, 0x05, 0x79, 0x05, 0x01,
                0x04, 0xe3,
            ]),
        )
    })

    it('sets LED to off', () => {
        const command = new ToggleNodeStatus(
            1,
            LockStatus.UNLOCKED,
            LEDBackgroundBrightness.OFF,
        ).withMessageID(121)

        expect(command.build()).toStrictEqual(
            Buffer.from([
                0x56, 0x54, 0x55, 0x3e, 0x1e, 0x00, 0x05, 0x79, 0x01, 0x00,
                0x00, 0xda,
            ]),
        )
    })
})
