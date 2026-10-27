import { BaseRequest } from '../core'
import type { RoomMetaData as RoomMetaDataResponse } from '../responses'
import { CommandID } from '../types'

export class RoomMetaData extends BaseRequest<RoomMetaDataResponse> {
    constructor(roomID: number) {
        super(CommandID.RoomMetaData, [roomID])
    }
}
