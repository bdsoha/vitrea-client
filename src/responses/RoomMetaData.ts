import {BaseResponse} from '../core'


export class RoomMetaData extends BaseResponse {
    protected static readonly idIndex           = 8
    protected static readonly nameIndex: number = 11

    get name() {
        return this.bufferToString(
            (<typeof RoomMetaData>this.constructor).nameIndex,
        )
    }

    get id() {
        return this.get((<typeof RoomMetaData>this.constructor).idIndex)
    }
}
