import {DataGram} from './DataGram'

class SampleDataGram extends DataGram {}

describe('DataGram', () => {
    it('has a constant prefix for all messages', () => {
        const datagram = new SampleDataGram()

        expect(datagram.get(0)).toBe(0x56)
        expect(datagram.get(1)).toBe(0x54)
        expect(datagram.get(2)).toBe(0x55)
    })

    it('knows the length of the internal buffer', () => {
        expect(new SampleDataGram()).toHaveLength(3)
    })

    it('has a direction index for messages', () => {
        expect(SampleDataGram.directionIndex).toBe(3)
    })

    it('has a message ID index for messages', () => {
        expect(SampleDataGram.messageIDIndex).toBe(7)
    })

    it('has a command ID index for messages', () => {
        expect(SampleDataGram.commandIDIndex).toBe(4)
    })
})
