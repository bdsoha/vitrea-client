import { DataGram }          from './DataGram'
import { MessageID }         from '../utilities/MessageID'
import { DataGramDirection } from '../utilities/Enums'

export abstract class BaseRequest extends DataGram {
    constructor(commandID = 0x00, data? : number[]) {
        super()

        this.buffer.push(DataGramDirection.OUTGOING, commandID)

        this.buffer[(<typeof BaseRequest>this.constructor).messageIDIndex] = MessageID.getNextID()

        if (Array.isArray(data)) {
            this.buffer.push(...data)
        }

        this.setDataLength()
    }

    protected setDataLength() {
        this.buffer.splice(
            (<typeof BaseRequest>this.constructor).dataLengthIndex,
            2,
            ...this.dataLength
        )
    }

    public build() {
        return Buffer.from(this.buffer.concat(this.checksum))
    }

    protected get toLog() {
        return {
            ...super.toLog,
            data: this.toHexString(this.data)
        }
    }
}
