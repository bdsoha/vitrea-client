import { CommandID }   from '../responses/ResponseCodes'
import { BaseRequest } from '../core'


export class RoomMetaData extends BaseRequest {
    constructor(roomID : number) {
        super(CommandID.RoomMetaData, [roomID])
    }
}
