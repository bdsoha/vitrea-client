import { KeyPowerStatus } from '../utilities/Enums'
import { KeyStatus } from './KeyStatus'


describe('KeyStatus', () => {
    const raw  = [
        0x56, 0x54, 0x55, 0x3C, 0x29, 0x00, 0x0A, 0x48, 0x01, 0x00, 0x46,
        0x00, 0x00, 0x00, 0x41, 0x00, 0x3E,
    ]

    it('converts a buffer array to an object', () => {
        const response = new KeyStatus(raw)
        
        expect(response).toHaveProperty('commandID', 0x29)
        expect(response).toHaveProperty('nodeID', 0x01)
        expect(response).toHaveProperty('keyID', 0x00)
        expect(response).toHaveProperty('power', KeyPowerStatus.OFF)
        expect(response).toHaveProperty('isOff', true)
        expect(response).toHaveProperty('isOn', false)
    })

    it('recieves a buffer or an array', () => {
        const buffer = Buffer.from(raw)

        expect(new KeyStatus(buffer)).toStrictEqual(new KeyStatus(raw))
    })
})
