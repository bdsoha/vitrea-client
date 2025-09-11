import { CommandID }   from '../types'
import { BaseRequest } from '../core'


export class InternalUnitStatuses extends BaseRequest {
    constructor() {
        super(CommandID.InternalUnitStatuses)
    }
}
