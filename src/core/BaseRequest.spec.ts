import { DataGramDirection } from '../types'
import { MessageID } from '../utilities/MessageID'
import { BaseRequest } from './BaseRequest'
import { DataGram } from './DataGram'

class SampleRequest extends BaseRequest {}

describe('BaseRequest', () => {
    beforeEach(() => MessageID.resetID())

    it('is an instance of DataGram', () => {
        expect(new SampleRequest()).toBeInstanceOf(DataGram)
    })

    it('[direction] prepends a byte for the direction of the messages', () => {
        expect(new SampleRequest().direction).toBe(DataGramDirection.OUTGOING)
    })

    it('[commandName] generates name from class signature', () => {
        expect(new SampleRequest().commandName).toBe('SampleRequest')
    })

    it('[checksum] calculates a checksum based on the sum of all values', () => {
        expect(new SampleRequest(0x00).checksum).toBe(0x40)
        expect(new SampleRequest(0x01).checksum).toBe(0x42)
        expect(new SampleRequest(0xc3).checksum).toBe(0x05)
    })

    it('[build] adds the checksum value to the end of the collection', () => {
        const datagram = new SampleRequest()

        expect(datagram).toHaveLength(8)

        expect(datagram.build()).toBeInstanceOf(Buffer)
        expect(datagram.build()).toHaveLength(9)
        expect(datagram.build()[8]).toBe(datagram.checksum)
    })

    it('generates an incremented message ID for each datagram', () => {
        vi.spyOn(MessageID, 'getNextID')

        expect(MessageID.getNextID).toHaveBeenCalledTimes(0)

        new SampleRequest()
        expect(MessageID.getNextID).toHaveBeenCalledTimes(1)

        new SampleRequest()
        expect(MessageID.getNextID).toHaveBeenCalledTimes(2)
    })

    it('[messageID] inserts the message ID in every message', () => {
        const id = 0x44
        MessageID.setNextID(id)

        const dataGram = new SampleRequest()
        const built = dataGram.build()

        expect(built[BaseRequest.messageIDIndex]).toBe(dataGram.messageID)
        expect(built[BaseRequest.messageIDIndex]).toBe(id)
    })

    it('[commandID] inserts the command ID in every message', () => {
        const commandID = 0xee
        const dataGram = new SampleRequest(commandID)
        const built = dataGram.build()

        expect(built[BaseRequest.commandIDIndex]).toBe(dataGram.commandID)
        expect(built[BaseRequest.commandIDIndex]).toBe(commandID)
    })

    it('[eventName] generates a unique event-listener name based on command & message IDs', () => {
        MessageID.setNextID(0xcc)

        expect(new SampleRequest(0xee).eventName).toBe('data::ee-cc')
    })

    it('[data] has a data series of arbitrary length', () => {
        expect(BaseRequest.dataIndex).toBe(8)

        const data = [0x33, 0x44, 0x55]
        const dataGram = new SampleRequest(0x00, data)

        expect(dataGram.getData()).toStrictEqual(data)
        expect(dataGram.hasData).toBeTruthy()

        const shortData = new SampleRequest(0x00, [0x33])
        expect(shortData.getData()).toStrictEqual([0x33])
        expect(shortData.hasData).toBeTruthy()

        const withoutData = new SampleRequest()

        expect(withoutData.getData()).toStrictEqual([])
        expect(withoutData.hasData).toBeFalsy()
    })

    it('[dataLength] knows the length of the data segment as a two-byte series', () => {
        const data = [0x33, 0x44, 0x55]
        const dataGram = new SampleRequest(0x00, data)

        expect(dataGram.dataLength).toStrictEqual([0x00, 0x05])
    })

    it('[dataLength]  knows the length of an empty data segment of the datagram', () => {
        const dataGram = new SampleRequest(0x00)

        expect(dataGram.dataLength).toStrictEqual([0x00, 0x02])
    })

    it('[logData] retrieve data to log', () => {
        const dataGram = new SampleRequest(0xff)

        expect(dataGram.logData).toStrictEqual({
            command: 'SampleRequest',
            commandID: '0xFF',
            data: '',
            direction: 'Outgoing',
            messageID: '0x01',
            raw: '56:54:55:3E:FF:00:02:01',
        })
    })

    it('[clone] returns same request with next messageID', () => {
        MessageID.setNextID(0x10)

        const original = new SampleRequest(0xab, [0x33, 0x44])

        const cloned = original.clone()

        expect(cloned.getData()).toStrictEqual(original.getData())

        expect(original.messageID).toBe(0x10)
        expect(cloned.commandID).toBe(0xab)
    })
})
