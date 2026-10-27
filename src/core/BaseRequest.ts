import type { Acknowledgement } from '../responses'
import { AckType, DataGramDirection, type ProtocolVersion } from '../types'
import type { BaseResponse } from './BaseResponse'
import { DataGram } from './DataGram'

export type AckOutcome = 'reject' | 'wait'

export abstract class BaseRequest<
    R extends BaseResponse = BaseResponse,
> extends DataGram {
    declare readonly response?: R

    constructor(commandID = 0x00, data?: number[]) {
        super()

        this.buffer.push(DataGramDirection.OUTGOING, commandID)

        this.buffer[this.$self.messageIDIndex] = 0x00

        if (Array.isArray(data)) {
            this.buffer.push(...data)
        }

        this.setDataLength()
    }

    protected setDataLength() {
        this.buffer.splice(this.$self.dataLengthIndex, 2, ...this.dataLength)
    }

    public withMessageID(messageID: number): this {
        this.buffer[this.$self.messageIDIndex] = messageID

        return this
    }

    public get replyCommands(): readonly number[] {
        return [this.commandID]
    }

    public matches(_response: R): boolean {
        return true
    }

    public handleAck(
        ack: Acknowledgement,
        _version: ProtocolVersion,
    ): AckOutcome {
        return ack.type === AckType.ERROR ? 'reject' : 'wait'
    }

    public build() {
        return Buffer.from(this.buffer.concat(this.checksum))
    }

    protected override get frame(): number[] {
        return [...this.buffer, this.checksum]
    }

    protected override get toLog() {
        return { data: this.toHexString(this.data) }
    }
}
