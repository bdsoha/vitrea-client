import { MessageID } from '../utilities/MessageID'
import { KeyParameters } from './KeyParameters'

describe('KeyParameters ', () => {
    it('requests the key parameters', () => {
        MessageID.setNextID(124)

        const command = new KeyParameters(1, 2)

        expect(command.build()).toStrictEqual(
            Buffer.from([
                0x56, 0x54, 0x55, 0x3e, 0x2b, 0x00, 0x04, 0x7c, 0x01, 0x02,
                0xeb,
            ]),
        )
    })
})
