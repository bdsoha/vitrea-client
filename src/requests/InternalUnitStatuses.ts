import { BaseRequest } from '../core'
import type { InternalUnitStatuses as InternalUnitStatusesResponse } from '../responses'
import { CommandID } from '../types'

export class InternalUnitStatuses extends BaseRequest<InternalUnitStatusesResponse> {
    constructor() {
        super(CommandID.InternalUnitStatuses)
    }
}
