import {BaseRequest} from './BaseRequest'
import {CommandID}   from '../responses/ResponseCodes'


export class RoomCount extends BaseRequest {
    constructor() {
        super(CommandID.RoomCount)
    }
}
