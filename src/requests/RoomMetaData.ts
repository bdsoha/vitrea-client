import {BaseRequest} from './BaseRequest'
import {CommandID}   from '../responses/ResponseCodes'


export class RoomMetaData extends BaseRequest {
    constructor(roomID : number) {
        super(CommandID.RoomMetaData, [roomID])
    }
}
