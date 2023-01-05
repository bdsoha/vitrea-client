import { CommandID }   from '../responses/ResponseCodes'
import { BaseRequest } from '../core'


export class NodeCount extends BaseRequest {
    constructor() {
        super(CommandID.NodeCount)
    }
}
