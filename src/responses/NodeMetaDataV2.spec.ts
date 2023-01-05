// import { KeyCategory, LEDBackgroundBrightness } from '../utilities/Enums'
import { NodeMetaDataV2 } from './NodeMetaDataV2'


describe('NodeMetaDataV2', () => {
    const raw =  [
        0x56, 0x54, 0x55, 0x3C, 0x1F, 0x00, 0x18, 0x3C, 0x01, 0x00, 0x15,
        0x8D, 0x00, 0x00, 0x69, 0xC4, 0xFF, 0x02, 0x02, 0x01, 0x02, 0x00,
        0x02, 0x83, 0x01, 0x07, 0x04, 0xFF, 0x07, 0x00, 0x1B,
    ]

    it.todo('converts a buffer array to an object')
    //     const response = new NodeMetaDataV2(raw)

    //     expect(response).toHaveProperty('commandID', 0x1F)
    //     expect(response).toHaveProperty('id', 0x01)
    //     expect(response).toHaveProperty('totalKeys', 0x02)
    //     expect(response).toHaveProperty('roomID', 0x07)
    //     expect(response).toHaveProperty('version', '1.74')
    //     expect(response).toHaveProperty('macAddress', '00:15:8D:00:00:69:C4:FF')
    //     expect(response).toHaveProperty('isLocked', false)
    //     expect(response).toHaveProperty('ledLevel', LEDBackgroundBrightness.HIGH)

    //     expect(response.keysList).toBeInstanceOf(Array)
    //     expect(response.keysList).toHaveLength(2)
    //     expect(response.keysList[0]).toStrictEqual({
    //         id:   0,
    //         type: KeyCategory.LIGHT,
    //     })
    // })

    it('recieves a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new NodeMetaDataV2(buffer)).toStrictEqual(new NodeMetaDataV2(raw))
    })
})
