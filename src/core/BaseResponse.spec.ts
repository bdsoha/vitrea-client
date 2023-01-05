import {DataGram}     from './DataGram'
import {BaseResponse} from './BaseResponse'
import { DataGramDirection } from '../utilities/Enums'

class SampleResponse extends BaseResponse { }

describe('BaseResponse', () => {
    it.todo('Validate the response data')

    const buffer = [
        0x56, 0x54, 0x55, 0x3C, 0x65, 0x00, 0x13, 0x31, 0x0A, 0x0A, 0x0E,
        0x43, 0x00, 0x75, 0x00, 0x72, 0x00, 0x74, 0x00, 0x61, 0x00, 0x69,
        0x00, 0x6E, 0x00, 0xDC,
    ]

    it('is an instance of DataGram', () => {
        expect(new SampleResponse(buffer)).toBeInstanceOf(DataGram)
    })

    it('[direction] prepends a byte for the direction of the messages', () => {
        expect(new SampleResponse(buffer).direction).toBe(DataGramDirection.INCOMING)
    })


    it('[messageID] extracts the message ID from a raw buffer object', () => {
        expect(new SampleResponse(buffer).messageID).toBe(0x31)
    })

    it('[commandID] extracts the command ID from a raw buffer object', () => {
        expect(new SampleResponse(buffer).commandID).toBe(0x65)
    })

    it('[getData] extracts the data from a raw buffer object', () => {
        expect(new SampleResponse(buffer).getData()).toStrictEqual([
            0x0A, 0x0A, 0x0E, 0x43, 0x00, 0x75, 0x00, 0x72, 0x00, 0x74, 0x00,
            0x61, 0x00, 0x69, 0x00, 0x6E, 0x00,
        ])
    })

    it('[dataLength] extracts the data length from a raw buffer object', () => {
        expect(new SampleResponse(buffer).dataLength).toStrictEqual([0x00, 0x13])
    })

    it('[hasValidChecksum] validates the checksum value', () => {
        const valid   = [0x56, 0x54, 0x55, 0x3C, 0x00, 0x00, 0x03, 0x00, 0x00, 0x3E]
        const invalid = [0x56, 0x54, 0x55, 0x3C, 0x00, 0x00, 0x03, 0x00, 0x00, 0x3D]

        expect(new SampleResponse(valid).hasValidChecksum).toBeTruthy()
        expect(new SampleResponse(invalid).hasValidChecksum).toBeFalsy()
    })
})
