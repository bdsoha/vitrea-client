import { BaseRequest } from '../core'
import type { RoomCount as RoomCountResponse } from '../responses'
import { CommandID } from '../types'

export class RoomCount extends BaseRequest<RoomCountResponse> {
    constructor() {
        super(CommandID.RoomCount)
    }
}
