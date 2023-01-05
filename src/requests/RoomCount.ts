import { CommandID }   from '../responses/ResponseCodes'
import { BaseRequest } from '../core'


export class RoomCount extends BaseRequest {
    constructor() {
        super(CommandID.RoomCount)
    }
}
