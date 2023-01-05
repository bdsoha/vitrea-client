import { CommandID }   from '../responses/ResponseCodes'
import { BaseRequest } from '../core'

export class InternalUnitStatuses extends BaseRequest {
    constructor() {
        super(CommandID.InternalUnitStatuses)
    }
}
