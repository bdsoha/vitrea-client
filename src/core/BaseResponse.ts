import { DataGram } from './DataGram'

export abstract class BaseResponse extends DataGram {
    protected readonly rawChecksum: number

    constructor(rawBuffer: Buffer | number[]) {
        super(Array.from(rawBuffer))
        this.rawChecksum = <number>this.buffer.pop()
    }

    get dataLength(): [number, number] {
        const start = this.$self.dataLengthIndex

        return [this.get(start), this.get(start + 1)]
    }

    get hasValidChecksum() {
        return this.checksum === this.rawChecksum
    }

    protected get toLog() {
        return { hasValidChecksum: this.hasValidChecksum }
    }
}
