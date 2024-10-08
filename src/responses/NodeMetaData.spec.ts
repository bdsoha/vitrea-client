import { NodeMetaData }                         from './NodeMetaData'
import { KeyCategory, LEDBackgroundBrightness } from '../utilities/Enums'


describe('NodeMetaData', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3C, 0x1F, 0x00, 0x18, 0x3C, 0x01, 0x00, 0x15,
        0x8D, 0x00, 0x00, 0x69, 0xC4, 0xFF, 0x02, 0x02, 0x01, 0x02, 0x00,
        0x02, 0x83, 0x01, 0x07, 0x04, 0xFF, 0x07, 0x00, 0x1B,
    ]

    it('converts a buffer array to an object', () => {
        const response = new NodeMetaData(raw)

        expect(response).toHaveProperty('commandID', 0x1F)
        expect(response).toHaveProperty('id', 0x01)
        expect(response).toHaveProperty('totalKeys', 0x02)
        expect(response).toHaveProperty('roomID', 0x07)
        expect(response).toHaveProperty('version', '1.74')
        expect(response).toHaveProperty('macAddress', '00:15:8D:00:00:69:C4:FF')
        expect(response).toHaveProperty('isLocked', false)
        expect(response).toHaveProperty('ledLevel', LEDBackgroundBrightness.HIGH)

        expect(response.keysList).toBeInstanceOf(Array)
        expect(response.keysList).toHaveLength(2)
        expect(response.keysList[0]).toStrictEqual({
            id:   0,
            type: KeyCategory.UNDEFINED,
        })
    })

    it('receives a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new NodeMetaData(buffer)).toStrictEqual(new NodeMetaData(raw))
    })

    it('[logData] retrieve data to log', () => {
        const dataGram = new NodeMetaData(raw)

        expect(dataGram.logData).toStrictEqual({
            command:          'NodeMetaData',
            commandID:        '0x1F',
            direction:        'Incoming',
            messageID:        '0x3C',
            hasValidChecksum: true,
            isLocked:         false,
            keysList:         [
                { id: 0, type: 0, },
                { id: 1, type: 2, },
            ],
            ledLevel:   2,
            macAddress: '00:15:8D:00:00:69:C4:FF',
            nodeID:     1,
            totalKeys:  2,
            version:    '1.74',
            raw:        '56:54:55:3C:1F:00:18:3C:01:00:15:8D:00:00:69:C4:FF:02:02:01:02:00:02:83:01:07:04:FF:07:00',
        })
    })
})
