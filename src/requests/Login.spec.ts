import { Login }     from './Login'
import { MessageID } from '../utilities/MessageID'


describe('Login', () => {
    beforeEach(() => MessageID.resetID())

    it('converts credentials as 16-byte characters', () => {
        const command = new Login('user', 'super')

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x01, 0x00, 0x16, 0x01, 0x08, 0x75, 0x00, 0x73,
            0x00, 0x65, 0x00, 0x72, 0x00, 0x0A, 0x73, 0x00, 0x75, 0x00, 0x70, 0x00,
            0x65, 0x00, 0x72, 0x00, 0x55
        ]))
    })

    it('[eventName] uses the Acknowledgement event name', () => {
        const command = new Login('user', 'super')

        expect(command).toHaveProperty('eventName', 'data::00-01')
    })
})
