import { AckType } from '../types'
import { Acknowledgement } from './Acknowledgement'

describe('Acknowledgement', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3c, 0x00, 0x00, 0x01, 0x48, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x3e,
    ]

    it('converts a buffer array to an object', () => {
        const response = new Acknowledgement(raw)

        expect(response).toHaveProperty('commandID', 0x00)
        expect(response).toHaveProperty('type', AckType.ACK)
        expect(response).toHaveProperty('isOK', true)
    })
})
