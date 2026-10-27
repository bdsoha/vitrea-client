import { FrameDecoder } from './FrameDecoder'

describe('FrameDecoder', () => {
    const frames = [
        [
            0x56, 0x54, 0x55, 0x3c, 0x29, 0x00, 0x0a, 0x06, 0x0b, 0x00, 0x4f,
            0x00, 0x00, 0x00, 0x55, 0x01, 0x24,
        ],
        [
            0x56, 0x54, 0x55, 0x3c, 0x29, 0x00, 0x0a, 0x07, 0x0b, 0x00, 0x46,
            0x00, 0x00, 0x00, 0x55, 0x01, 0x1c,
        ],
        [
            0x56, 0x54, 0x55, 0x3c, 0x1d, 0x00, 0x0b, 0x1e, 0x08, 0x00, 0x01,
            0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0xa5,
        ],
    ].map(frame => Buffer.from(frame))

    const stream = Buffer.concat(frames)

    it('[push] returns every frame from a single chunk', () => {
        expect(new FrameDecoder().push(stream)).toEqual(frames)
    })

    it('[push] joins frames split across two chunks at any offset', () => {
        for (let offset = 1; offset < stream.length; offset++) {
            const decoder = new FrameDecoder()

            expect([
                ...decoder.push(stream.subarray(0, offset)),
                ...decoder.push(stream.subarray(offset)),
            ]).toEqual(frames)
        }
    })

    it('[push] waits for the rest of a frame fed byte by byte', () => {
        const decoder = new FrameDecoder()
        const decoded = [...stream].flatMap(byte =>
            decoder.push(Buffer.from([byte])),
        )

        expect(decoded).toEqual(frames)
    })

    it('[push] keeps a frame whose data contains the header shifted by a nibble', () => {
        const frame = Buffer.from([
            0x56, 0x54, 0x55, 0x3c, 0x00, 0x00, 0x07, 0x01, 0x05, 0x65, 0x45,
            0x53, 0xc0, 0x05,
        ])

        expect(new FrameDecoder().push(frame)).toEqual([frame])
    })

    it('[push] resyncs on the next frame when a length field is wrong', () => {
        const truncated = Buffer.from([
            0x56, 0x54, 0x55, 0x3c, 0xc8, 0x00, 0x0e, 0x64, 0x03, 0xff, 0x00,
            0x0d, 0x6f, 0x00, 0x16, 0x17, 0x09, 0x54, 0x7d,
        ])

        expect(
            new FrameDecoder().push(Buffer.concat([truncated, ...frames])),
        ).toEqual(frames)
    })

    it('[push] survives a long run of headers with bad checksums', () => {
        const header = [0x56, 0x54, 0x55, 0x3c, 0x00, 0x00, 0x02]
        const noise = Buffer.from(
            Array.from({ length: 20_000 }, () => header).flat(),
        )

        expect(new FrameDecoder().push(Buffer.concat([noise, stream]))).toEqual(
            frames,
        )
    })

    it('[push] skips bytes before the first header', () => {
        const noise = Buffer.from([0x01, 0x02, 0x56, 0x54, 0x09])

        expect(new FrameDecoder().push(Buffer.concat([noise, stream]))).toEqual(
            frames,
        )
    })
})
