import { BaseRequest } from '../core'
import { CommandID } from '../types'

export class InternalUnitStatuses extends BaseRequest {
    constructor() {
        super(CommandID.InternalUnitStatuses)
    }
}
