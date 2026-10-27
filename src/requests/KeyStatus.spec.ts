import { KeyStatus } from './KeyStatus'

describe('KeyStatus ', () => {
    it('requests the status for a key', () => {
        const command = new KeyStatus(1, 2).withMessageID(121)

        expect(command.build()).toStrictEqual(
            Buffer.from([
                0x56, 0x54, 0x55, 0x3e, 0x29, 0x00, 0x04, 0x79, 0x01, 0x02,
                0xe6,
            ]),
        )
    })
})
