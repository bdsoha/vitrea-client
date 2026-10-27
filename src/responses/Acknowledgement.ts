import { BaseResponse } from '../core'
import { AckType, type LogLevel } from '../types'

export class Acknowledgement extends BaseResponse {
    static override readonly logLevel: LogLevel = 'debug'

    protected static readonly typeIndex = 8

    get type(): AckType {
        return this.get(this.$self.typeIndex) as AckType
    }

    get isOK(): boolean {
        return this.type === AckType.ACK
    }

    protected override get toLog() {
        return { ...super.toLog, type: this.type }
    }
}
