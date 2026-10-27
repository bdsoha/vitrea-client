import { DataGram } from '../core/DataGram'
import { DataGramDirection } from '../types'

export class FrameDecoder {
    protected static readonly header = Buffer.from([
        ...DataGram.prefix,
        DataGramDirection.INCOMING,
    ])

    protected static readonly headerLength = DataGram.dataLengthIndex + 2

    protected pending = Buffer.alloc(0)

    public push(chunk: Buffer): Buffer[] {
        this.pending = Buffer.concat([this.pending, chunk])

        const frames: Buffer[] = []

        for (let frame = this.shift(); frame; frame = this.shift()) {
            frames.push(frame)
        }

        return frames
    }

    protected shift(): Buffer | undefined {
        while (this.alignToHeader()) {
            const frame = this.peekFrame()

            if (!frame) {
                return undefined
            }

            if (FrameDecoder.hasValidChecksum(frame)) {
                this.pending = this.pending.subarray(frame.length)

                return frame
            }

            this.pending = this.pending.subarray(1)
        }

        return undefined
    }

    protected alignToHeader(): boolean {
        const { header } = FrameDecoder
        const start = this.pending.indexOf(header)

        if (start === -1) {
            this.pending = this.pending.subarray(1 - header.length)

            return false
        }

        this.pending = this.pending.subarray(start)

        return true
    }

    protected peekFrame(): Buffer | undefined {
        const { headerLength } = FrameDecoder

        if (this.pending.length < headerLength) {
            return undefined
        }

        const size =
            headerLength + this.pending.readUInt16BE(DataGram.dataLengthIndex)

        if (this.pending.length < size) {
            return undefined
        }

        return this.pending.subarray(0, size)
    }

    protected static hasValidChecksum(frame: Buffer): boolean {
        const checksum = frame
            .subarray(0, -1)
            .reduce((sum, byte) => (sum + byte) & 0xff, 0)

        return checksum === frame[frame.length - 1]
    }
}
