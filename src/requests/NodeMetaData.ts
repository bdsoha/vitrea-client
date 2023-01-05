import { CommandID }   from '../responses/ResponseCodes'
import { BaseRequest } from '../core'


export class NodeMetaData extends BaseRequest {
    constructor(nodeID : number) {
        super(CommandID.NodeMetaData, [nodeID])
    }
}
