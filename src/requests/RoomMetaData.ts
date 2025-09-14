import { BaseRequest } from '../core'
import { CommandID } from '../types'

export class RoomMetaData extends BaseRequest {
    constructor(roomID: number) {
        super(CommandID.RoomMetaData, [roomID])
    }
}
