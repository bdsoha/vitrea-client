import { BaseRequest } from '../core'
import type { NodeMetaData as NodeMetaDataResponse } from '../responses'
import { CommandID } from '../types'

export class NodeMetaData extends BaseRequest<NodeMetaDataResponse> {
    constructor(nodeID: number) {
        super(CommandID.NodeMetaData, [nodeID])
    }
}
