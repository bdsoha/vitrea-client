import { BaseRequest } from '../core'
import { CommandID } from '../types'

export class NodeCount extends BaseRequest {
    constructor() {
        super(CommandID.NodeCount)
    }
}
