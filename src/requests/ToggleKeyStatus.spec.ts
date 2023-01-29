import { MessageID }        from '../utilities/MessageID'
import { KeyPowerStatus }   from '../utilities/Enums'
import { ToggleKeyStatus  } from './ToggleKeyStatus'


describe('ToggleKeyStatus ', () => {
    beforeEach(() => MessageID.setNextID(121))

    it('requests to toggle the power status', () => {
        const command = new ToggleKeyStatus(1, 2, KeyPowerStatus.OFF)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x28, 0x00, 0x08, 0x79, 0x01,
            0x02, 0x46, 0x00, 0x00, 0x00, 0x2F
        ]))
    })

    it('sets dimmer ratio', () => {
        const command = new ToggleKeyStatus(1, 2, KeyPowerStatus.OFF, {dimmerRatio: 99})

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x28, 0x00, 0x08, 0x79, 0x01,
            0x02, 0x46, 0x63, 0x00, 0x00, 0x92
        ]))
    })

    it('sets timer', () => {
        const command = new ToggleKeyStatus(1, 2, KeyPowerStatus.OFF, {timer: 6890})

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x28, 0x00, 0x08, 0x79, 0x01,
            0x02, 0x46, 0x00, 0x1A, 0xEA, 0x04
        ]))
    })

    it('[eventName] uses the acknowledgement event name', () => {
        const command = new ToggleKeyStatus(1, 2, KeyPowerStatus.OFF)

        expect(command).toHaveProperty('eventName', 'data::00-79')
    })
})
