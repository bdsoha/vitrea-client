import { NodeMetaDataV2 }                       from './NodeMetaDataV2'
import { KeyCategory, LEDBackgroundBrightness } from '../utilities/Enums'


describe('NodeMetaDataV2', () => {
    const raw =  [
        0x56, 0x54, 0x55, 0x3C, 0x1F, 0x00, 0x1B, 0x34, 0x01, 0x00,
        0x0D, 0x6F, 0x00, 0x0E, 0xFB, 0x96, 0x21, 0x02, 0x03, 0x03,
        0x02, 0x02, 0x02, 0x00, 0x02, 0x83, 0x07, 0x09, 0x03, 0x00,
        0x00, 0x00, 0x00, 0x8C
    ]

    it('converts a buffer array to an object', () => {
        const response = new NodeMetaDataV2(raw)

        expect(response).toHaveProperty('commandID', 0x1F)
        expect(response).toHaveProperty('id', 1)
        expect(response).toHaveProperty('totalKeys', 3)
        expect(response).toHaveProperty('roomID', 0)
        expect(response).toHaveProperty('version', '7.93')
        expect(response).toHaveProperty('macAddress', '00:0D:6F:00:0E:FB:96:21')
        expect(response).toHaveProperty('isLocked', false)
        expect(response).toHaveProperty('ledLevel', LEDBackgroundBrightness.HIGH)

        expect(response.keysList).toBeInstanceOf(Array)
        expect(response.keysList).toHaveLength(3)
        expect(response.keysList[0]).toStrictEqual({
            id:   0,
            type: KeyCategory.UNDEFINED,
        })
    })

    it('receives a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new NodeMetaDataV2(buffer)).toStrictEqual(new NodeMetaDataV2(raw))
    })
})
