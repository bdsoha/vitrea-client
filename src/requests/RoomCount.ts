import { BaseRequest } from '../core'
import { CommandID } from '../types'

export class RoomCount extends BaseRequest {
    constructor() {
        super(CommandID.RoomCount)
    }
}
