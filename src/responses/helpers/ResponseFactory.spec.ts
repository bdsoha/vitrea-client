import { DataGramDirection, ProtocolVersion } from '../../types'
import { NodeMetaDataV2 } from '../NodeMetaDataV2'
import { RoomCount } from '../RoomCount'
import { ResponseFactory } from './ResponseFactory'

describe('ResponseFactory', () => {
    it('converts a known raw buffer into a response object', () => {
        const raw = [
            0x56, 0x54, 0x55, 0x3c, 0x1d, 0x00, 0x0b, 0x1e, 0x08, 0x00, 0x01,
            0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0xa5,
        ]
        const buffer = Buffer.from(raw)

        const response = ResponseFactory.find(buffer, ProtocolVersion.V1)

        expect(response).toBeInstanceOf(RoomCount)
        expect(response).toStrictEqual(new RoomCount(raw))
    })

    it('ignores responses with unknown command types', () => {
        const unknownCommand = 0x00
        const raw = Buffer.from([0x56, 0x54, 0x55, 0x3c, unknownCommand])

        expect(ResponseFactory.find(raw, ProtocolVersion.V1)).toBeFalsy()
    })

    it('filters outgoing data that was passed to the factory', () => {
        const raw = Buffer.from([
            0x56,
            0x54,
            0x55,
            DataGramDirection.OUTGOING,
            0x1d,
            0x00,
            0x0b,
            0x1e,
        ])

        expect(ResponseFactory.find(raw, ProtocolVersion.V1)).toBeFalsy()
    })

    it('retrieves `v2` responses', () => {
        const raw = [
            0x56, 0x54, 0x55, 0x3c, 0x1f, 0x00, 0x18, 0x3c, 0x01, 0x00, 0x15,
            0x8d, 0x00, 0x00, 0x69, 0xc4, 0xff, 0x02, 0x02, 0x01, 0x02, 0x00,
            0x02, 0x83, 0x01, 0x07, 0x04, 0xff, 0x07, 0x00, 0x1b,
        ]
        const buffer = Buffer.from(raw)

        const response = ResponseFactory.find(buffer, ProtocolVersion.V2)

        expect(response).toBeInstanceOf(NodeMetaDataV2)
        expect(response).toStrictEqual(new NodeMetaDataV2(raw))
    })
})
