import { BaseRequest } from '../core'
import {CommandID}   from '../responses/ResponseCodes'


export class RoomCount extends BaseRequest {
    constructor() {
        super(CommandID.RoomCount)
    }
}
