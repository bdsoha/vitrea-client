import { BaseResponse } from '../core'
import { AckType } from '../types'

export class Acknowledgement extends BaseResponse {
    protected static readonly typeIndex = 8

    get type(): AckType {
        return this.get(this.$self.typeIndex) as AckType
    }

    get isOK(): boolean {
        return this.type === AckType.ACK
    }
}
