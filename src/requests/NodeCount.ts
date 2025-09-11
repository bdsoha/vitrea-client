import { CommandID }   from '../types'
import { BaseRequest } from '../core'


export class NodeCount extends BaseRequest {
    constructor() {
        super(CommandID.NodeCount)
    }
}
