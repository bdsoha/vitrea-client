import { SplitMultipleBuffers } from './SplitMultipleBuffers'


describe('SplitMultipleBuffers', () => {
    const raw = [
        0x56, 0x54, 0x55, 0x3C, 0x1D, 0x00, 0x0B, 0x1E, 0x08, 0x00, 0x01,
        0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0xA5,
    ]

    it('wraps a single message as an array of one buffer', () => {
        const buffer = Buffer.from(raw)
        const split = SplitMultipleBuffers.handle(buffer)

        expect(split).toHaveLength(1)
        expect(split).toEqual([buffer])
    })

    it('splits messages that were received on the same interval as multiple buffers', () => {
        const buffer = Buffer.from([...raw, ...raw])
        const split = SplitMultipleBuffers.handle(buffer)

        expect(split).toHaveLength(2)
        expect(split).toEqual([
            Buffer.from(raw),
            Buffer.from(raw),
        ])
    })
})
