import { KeyCategory } from '../types'
import { KeyParameters } from './KeyParameters'

describe('KeyParameters', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3c, 0x2b, 0x00, 0x44, 0x60, 0x02, 0x00, 0xff, 0x01,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x73, 0x3a, 0x36, 0x4b, 0x00, 0x69, 0x00,
        0x74, 0x00, 0x63, 0x00, 0x68, 0x00, 0x65, 0x00, 0x6e, 0x00, 0x20, 0x00,
        0x49, 0x00, 0x73, 0x00, 0x6c, 0x00, 0x61, 0x00, 0x6e, 0x00, 0x64, 0x00,
        0x20, 0x00, 0x26, 0x00, 0x20, 0x00, 0x54, 0x00, 0x61, 0x00, 0x62, 0x00,
        0x6c, 0x00, 0x65, 0x00, 0x20, 0x00, 0x28, 0x00, 0x4d, 0x00, 0x57, 0x00,
        0x29, 0x00, 0x93,
    ]

    it('converts a buffer array to an object', () => {
        const response = new KeyParameters(raw)

        expect(response).toHaveProperty('commandID', 0x2b)
        expect(response).toHaveProperty('name', 'Kitchen Island & Table (MW)')
        expect(response).toHaveProperty('nodeID', 2)
        expect(response).toHaveProperty('keyID', 0x00)
        expect(response).toHaveProperty('category', KeyCategory.LIGHT)
    })

    it('receives a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new KeyParameters(buffer)).toStrictEqual(new KeyParameters(raw))
    })

    it('[logData] retrieve data to log', () => {
        const dataGram = new KeyParameters(raw)

        expect(dataGram.logData).toStrictEqual({
            command: 'KeyParameters',
            commandID: '0x2B',
            direction: 'Incoming',
            messageID: '0x60',
            hasValidChecksum: true,
            category: 1,
            name: 'Kitchen Island & Table (MW)',
            nodeID: 2,
            keyID: 0,
            raw: [
                '56:54:55:3C:2B:00:44:60:02:00:FF:01:00:00:00:00:00:73:3A',
                '36:4B:00:69:00:74:00:63:00:68:00:65:00:6E:00:20:00:49:00',
                '73:00:6C:00:61:00:6E:00:64:00:20:00:26:00:20:00:54:00:61',
                '00:62:00:6C:00:65:00:20:00:28:00:4D:00:57:00:29:00',
            ].join(':'),
        })
    })
})
