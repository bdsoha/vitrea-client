import { BaseResponse } from '../core'


export class RoomMetaData extends BaseResponse {
    protected static readonly idIndex           = 8
    protected static readonly nameIndex: number = 11

    get name() {
        return this.bufferToString(
            this.$self.nameIndex,
        )
    }

    get id() {
        return this.get(this.$self.idIndex)
    }
}
