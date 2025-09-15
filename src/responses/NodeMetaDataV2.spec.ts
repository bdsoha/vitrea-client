import { KeyType, LEDBackgroundBrightness, NodeType } from '../types'
import { NodeMetaDataV2 } from './NodeMetaDataV2'

describe('NodeMetaDataV2', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3c, 0x1f, 0x00, 0x1b, 0x34, 0x01, 0x00, 0x0d, 0x6f,
        0x00, 0x0e, 0xfb, 0x96, 0x21, 0x02, 0x03, 0x03, 0x02, 0x02, 0x02, 0x00,
        0x02, 0x83, 0x07, 0x09, 0x03, 0x00, 0x00, 0x00, 0x00, 0x8c,
    ]

    it('converts a buffer array to an object', () => {
        const response = new NodeMetaDataV2(raw)

        expect(response).toHaveProperty('commandID', 0x1f)
        expect(response).toHaveProperty('id', 1)
        expect(response).toHaveProperty('type', NodeType.VT_MW3_SR3_10A)
        expect(response).toHaveProperty('model', 'VT-MW3-SR3-10A')
        expect(response).toHaveProperty('totalKeys', 3)
        expect(response).toHaveProperty('roomID', 0)
        expect(response).toHaveProperty('version', '7.93')
        expect(response).toHaveProperty('macAddress', '00:0D:6F:00:0E:FB:96:21')
        expect(response).toHaveProperty('isLocked', false)
        expect(response).toHaveProperty(
            'ledLevel',
            LEDBackgroundBrightness.NORMAL,
        )

        expect(response.keysList).toBeInstanceOf(Array)
        expect(response.keysList).toHaveLength(3)
        expect(response.keysList[0]).toStrictEqual({
            id: 0,
            type: KeyType.TOGGLE,
        })
    })

    it('receives a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new NodeMetaDataV2(buffer)).toStrictEqual(
            new NodeMetaDataV2(raw),
        )
    })

    it('[keysList] maps KeyType values', () => {
        const raw = [
            0x56, 0x54, 0x55, 0x3c, 0x1f, 0x00, 0x20, 0x05, 0x02, 0x00, 0x0d,
            0x6f, 0x00, 0x16, 0x17, 0xde, 0xb6, 0x02, 0x15, 0x08, 0x02, 0x01,
            0x02, 0x02, 0x04, 0x02, 0x04, 0x02, 0x00, 0x02, 0x83, 0x07, 0x09,
            0x03, 0x00, 0x00, 0x00, 0x00,
        ]

        const response = new NodeMetaDataV2(raw)

        expect(response.totalKeys).toBe(8)
        expect(response.keysList).toHaveLength(8)

        expect(response.keysList[0].type).toBe(KeyType.TOGGLE)
        expect(response.keysList[1].type).toBe(KeyType.NOT_ACTIVE)
        expect(response.keysList[2].type).toBe(KeyType.TOGGLE)
        expect(response.keysList[3].type).toBe(KeyType.TOGGLE)
        expect(response.keysList[4].type).toBe(KeyType.PUSH_BUTTON)
        expect(response.keysList[5].type).toBe(KeyType.TOGGLE)
        expect(response.keysList[6].type).toBe(KeyType.PUSH_BUTTON)
        expect(response.keysList[7].type).toBe(KeyType.TOGGLE)
    })
})
