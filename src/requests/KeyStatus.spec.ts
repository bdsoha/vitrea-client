import { MessageID }  from '../utilities/MessageID'
import { KeyStatus  } from './KeyStatus'


describe('KeyStatus ', () => {
    it('requests the status for a key', () => {
        MessageID.setNextID(121)

        const command = new KeyStatus(1, 2)

        expect(command.build()).toStrictEqual(Buffer.from([
            0x56, 0x54, 0x55, 0x3E, 0x29, 0x00, 0x04, 0x79, 0x01, 0x02, 0xE6
        ]))
    })

    it('[eventName] uses the *status update* event name', () => {
        const command = new KeyStatus(1, 2)

        expect(command).toHaveProperty('eventName', 'vitrea::status::update')
    })
})
