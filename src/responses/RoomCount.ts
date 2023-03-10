import { BaseResponse } from '../core'

export class RoomCount extends BaseResponse {
    public get total() {
        return this.list.length
    }

    public get list() {
        return this.data.slice(1)
    }
}
