import { BaseRequest } from '../core'
import {CommandID}   from '../responses/ResponseCodes'


export class RoomMetaData extends BaseRequest {
    constructor(roomID : number) {
        super(CommandID.RoomMetaData, [roomID])
    }
}
