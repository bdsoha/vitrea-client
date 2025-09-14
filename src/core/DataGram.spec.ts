import { DataGram } from './DataGram'

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

    it('[logData] retrieve data to log', () => {
        const buffer = [
            0x56, 0x54, 0x55, 0x3c, 0x65, 0x00, 0x13, 0x31, 0x0a, 0x0a, 0x0e,
            0x43, 0x00, 0x75, 0x00, 0x72, 0x00, 0x74, 0x00, 0x61, 0x00, 0x69,
            0x00, 0x6e, 0x00, 0xdc,
        ]

        const dataGram = new SampleDataGram(buffer)

        expect(dataGram.logData).toStrictEqual({
            command: 'SampleDataGram',
            commandID: '0x65',
            direction: 'Incoming',
            messageID: '0x31',
            raw: '56:54:55:3C:65:00:13:31:0A:0A:0E:43:00:75:00:72:00:74:00:61:00:69:00:6E:00:DC',
        })
    })
})
