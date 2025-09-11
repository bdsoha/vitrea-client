import { CommandID }   from '../types'
import { BaseRequest } from '../core'


export class RoomCount extends BaseRequest {
    constructor() {
        super(CommandID.RoomCount)
    }
}
