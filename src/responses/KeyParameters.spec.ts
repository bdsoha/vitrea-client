import { KeyCategory }   from '../utilities/Enums'
import { KeyParameters } from './KeyParameters'


describe('KeyParameters', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3C, 0x2B, 0x00, 0x33, 0x78, 0x01, 0x00, 0xFF, 0x01,
        0x00, 0x78, 0x78, 0x01, 0x64, 0x01, 0x00, 0x00, 0x24, 0x44, 0x00, 0x69,
        0x00, 0x6E, 0x00, 0x69, 0x00, 0x6E, 0x00, 0x67, 0x00, 0x20, 0x00, 0x52,
        0x00, 0x6F, 0x00, 0x6F, 0x00, 0x6D, 0x00, 0x20, 0x00, 0x54, 0x00, 0x6F,
        0x00, 0x69, 0x00, 0x6C, 0x00, 0x65, 0x00, 0x74, 0x00, 0x33
    ]

    it('converts a buffer array to an object', () => {
        const response = new KeyParameters(raw)

        expect(response).toHaveProperty('commandID', 0x2B)
        expect(response).toHaveProperty('name', 'Dining Room Toilet')
        expect(response).toHaveProperty('nodeID', 1)
        expect(response).toHaveProperty('keyID', 0x00)
        expect(response).toHaveProperty('category', KeyCategory.LIGHT)
    })

    it('recieves a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new KeyParameters(buffer)).toStrictEqual(new KeyParameters(raw))
    })
})
