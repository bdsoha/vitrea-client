import { BaseRequest } from '../core'
import {CommandID}   from '../responses/ResponseCodes'


export class NodeMetaData extends BaseRequest {
    constructor(nodeID : number) {
        super(CommandID.NodeMetaData, [nodeID])
    }
}
