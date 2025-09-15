import { DataGramDirection } from '../types'
import { MessageID } from '../utilities/MessageID'
import { DataGram } from './DataGram'

export abstract class BaseRequest extends DataGram {
    constructor(commandID = 0x00, data?: number[]) {
        super()

        this.buffer.push(DataGramDirection.OUTGOING, commandID)

        this.buffer[this.$self.messageIDIndex] = MessageID.getNextID()

        if (Array.isArray(data)) {
            this.buffer.push(...data)
        }

        this.setDataLength()
    }

    protected setDataLength() {
        this.buffer.splice(this.$self.dataLengthIndex, 2, ...this.dataLength)
    }

    public build() {
        return Buffer.from(this.buffer.concat(this.checksum))
    }

    public clone(): this {
        const builder = this.constructor as new (
            ...args: ConstructorParameters<typeof BaseRequest>
        ) => this

        return new builder(this.commandID, this.getData())
    }

    protected override get toLog() {
        return { data: this.toHexString(this.data) }
    }
}
