import { BaseRequest } from '../core'
import {CommandID}   from '../responses/ResponseCodes'

export class InternalUnitStatuses extends BaseRequest {
    constructor() {
        super(CommandID.InternalUnitStatuses)
    }
}
