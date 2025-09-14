import { BaseRequest } from '../core'
import { CommandID } from '../types'

export class NodeMetaData extends BaseRequest {
    constructor(nodeID: number) {
        super(CommandID.NodeMetaData, [nodeID])
    }
}
