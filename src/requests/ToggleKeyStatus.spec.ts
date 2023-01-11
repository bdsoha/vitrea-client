import { MessageID }        from '../utilities/MessageID'
import { KeyPowerStatus }   from '../utilities/Enums'
import { ToggleKeyStatus  } from './ToggleKeyStatus'


describe('ToggleKeyStatus ', () => {
    it('requests to toggle the power status', () => {
        MessageID.setNextID(121)

        const command = new ToggleKeyStatus(1, 2, KeyPowerStatus.OFF)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x28, 0x00, 0x08, 0x79, 0x01,
            0x02, 0x46, 0x00, 0x00, 0x00, 0x2F
        ]))
    })

    it('[eventName] uses the acknowledgement event name', () => {
        const command = new ToggleKeyStatus(1, 2, KeyPowerStatus.OFF)

        expect(command).toHaveProperty('eventName', 'data::00-7a')
    })
})
