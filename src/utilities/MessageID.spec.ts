import { MessageID } from './MessageID'

describe('Message ID', () => {
    beforeEach(() => MessageID.resetID())

    it('generates an incremented ID', () => {
        expect(MessageID.getNextID()).toBe(0x01)
        expect(MessageID.getNextID()).toBe(0x02)
        expect(MessageID.getNextID()).toBe(0x03)
    })

    it('the largest ID is 255 followed by 1', () => {
        MessageID.resetID(0xfe)
        expect(MessageID.getNextID()).toBe(0xff)
        expect(MessageID.getNextID()).toBe(0x01)
    })
})
