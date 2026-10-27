import { BaseRequest } from '../core'
import type { NodeCount as NodeCountResponse } from '../responses'
import { CommandID } from '../types'

export class NodeCount extends BaseRequest<NodeCountResponse> {
    constructor() {
        super(CommandID.NodeCount)
    }
}
