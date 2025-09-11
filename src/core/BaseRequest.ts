import { DataGram }          from './DataGram'
import { MessageID }         from '../utilities/MessageID'
import { DataGramDirection } from '../utilities/Enums'


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
        this.buffer.splice(
            this.$self.dataLengthIndex,
            2,
            ...this.dataLength
        )
    }

    public build() {
        return Buffer.from(this.buffer.concat(this.checksum))
    }

    public clone(): this {
        const constructor = (this.constructor as new (...args: ConstructorParameters<typeof BaseRequest>) => this)

        return new constructor(this.commandID, this.getData())
    }

    protected get toLog() {
        return { data: this.toHexString(this.data) }
    }
}
