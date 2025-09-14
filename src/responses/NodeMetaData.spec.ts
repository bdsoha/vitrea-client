import { KeyType, LEDBackgroundBrightness, NodeType } from '../utilities/Enums'
import { NodeMetaData } from './NodeMetaData'

describe('NodeMetaData', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3c, 0x1f, 0x00, 0x18, 0x3c, 0x01, 0x00, 0x15, 0x8d,
        0x00, 0x00, 0x69, 0xc4, 0xff, 0x02, 0x02, 0x01, 0x02, 0x00, 0x02, 0x83,
        0x01, 0x07, 0x04, 0xff, 0x07, 0x00, 0x1b,
    ]

    it('converts a buffer array to an object', () => {
        const response = new NodeMetaData(raw)

        expect(response).toHaveProperty('commandID', 0x1f)
        expect(response).toHaveProperty('id', 0x01)
        expect(response).toHaveProperty('totalKeys', 0x02)
        expect(response).toHaveProperty('roomID', 0x07)
        expect(response).toHaveProperty('type', NodeType.VT_MW3_SR2_10A)
        expect(response).toHaveProperty('model', 'VT-MW3-SR2-10A')
        expect(response).toHaveProperty('version', '1.74')
        expect(response).toHaveProperty('macAddress', '00:15:8D:00:00:69:C4:FF')
        expect(response).toHaveProperty('isLocked', false)
        expect(response).toHaveProperty(
            'ledLevel',
            LEDBackgroundBrightness.NORMAL,
        )

        expect(response.keysList).toBeInstanceOf(Array)
        expect(response.keysList).toHaveLength(2)
        expect(response.keysList[0]).toStrictEqual({
            id: 0,
            type: KeyType.NOT_EXIST,
        })
    })

    it('receives a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new NodeMetaData(buffer)).toStrictEqual(new NodeMetaData(raw))
    })

    it('[logData] retrieve data to log', () => {
        const dataGram = new NodeMetaData(raw)

        expect(dataGram.logData).toStrictEqual({
            command: 'NodeMetaData',
            commandID: '0x1F',
            direction: 'Incoming',
            messageID: '0x3C',
            hasValidChecksum: true,
            isLocked: false,
            keysList: [
                { id: 0, type: 0 },
                { id: 1, type: 2 },
            ],
            ledLevel: 2,
            macAddress: '00:15:8D:00:00:69:C4:FF',
            nodeID: 1,
            type: 2,
            model: 'VT-MW3-SR2-10A',
            totalKeys: 2,
            version: '1.74',
            raw: '56:54:55:3C:1F:00:18:3C:01:00:15:8D:00:00:69:C4:FF:02:02:01:02:00:02:83:01:07:04:FF:07:00',
        })
    })
})
