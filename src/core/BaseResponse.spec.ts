import { DataGramDirection } from '../utilities/Enums'
import { BaseResponse } from './BaseResponse'
import { DataGram } from './DataGram'

class SampleResponse extends BaseResponse {}

describe('BaseResponse', () => {
    it.todo('Validate the response data')

    const buffer = [
        0x56, 0x54, 0x55, 0x3c, 0x65, 0x00, 0x13, 0x31, 0x0a, 0x0a, 0x0e, 0x43,
        0x00, 0x75, 0x00, 0x72, 0x00, 0x74, 0x00, 0x61, 0x00, 0x69, 0x00, 0x6e,
        0x00, 0xdc,
    ]

    it('is an instance of DataGram', () => {
        expect(new SampleResponse(buffer)).toBeInstanceOf(DataGram)
    })

    it('[direction] prepends a byte for the direction of the messages', () => {
        expect(new SampleResponse(buffer).direction).toBe(
            DataGramDirection.INCOMING,
        )
    })

    it('[messageID] extracts the message ID from a raw buffer object', () => {
        expect(new SampleResponse(buffer).messageID).toBe(0x31)
    })

    it('[commandID] extracts the command ID from a raw buffer object', () => {
        expect(new SampleResponse(buffer).commandID).toBe(0x65)
    })

    it('[getData] extracts the data from a raw buffer object', () => {
        expect(new SampleResponse(buffer).getData()).toStrictEqual([
            0x0a, 0x0a, 0x0e, 0x43, 0x00, 0x75, 0x00, 0x72, 0x00, 0x74, 0x00,
            0x61, 0x00, 0x69, 0x00, 0x6e, 0x00,
        ])
    })

    it('[dataLength] extracts the data length from a raw buffer object', () => {
        expect(new SampleResponse(buffer).dataLength).toStrictEqual([
            0x00, 0x13,
        ])
    })

    it('[hasValidChecksum] validates the checksum value', () => {
        const valid = [
            0x56, 0x54, 0x55, 0x3c, 0x00, 0x00, 0x03, 0x00, 0x00, 0x3e,
        ]
        const invalid = [
            0x56, 0x54, 0x55, 0x3c, 0x00, 0x00, 0x03, 0x00, 0x00, 0x3d,
        ]

        expect(new SampleResponse(valid).hasValidChecksum).toBeTruthy()
        expect(new SampleResponse(invalid).hasValidChecksum).toBeFalsy()
    })

    it('[logData] retrieve data to log', () => {
        const dataGram = new SampleResponse(buffer)

        expect(dataGram.logData).toStrictEqual({
            command: 'SampleResponse',
            commandID: '0x65',
            direction: 'Incoming',
            messageID: '0x31',
            hasValidChecksum: true,
            raw: '56:54:55:3C:65:00:13:31:0A:0A:0E:43:00:75:00:72:00:74:00:61:00:69:00:6E:00',
        })
    })
})
