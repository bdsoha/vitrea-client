import {BaseRequest} from './BaseRequest'
import {CommandID}   from '../responses/ResponseCodes'

export class InternalUnitStatuses extends BaseRequest {
    constructor() {
        super(CommandID.InternalUnitStatuses)
    }
}
