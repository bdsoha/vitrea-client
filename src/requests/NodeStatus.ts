import {BaseRequest} from './BaseRequest'


export class NodeStatus extends BaseRequest {
    constructor(nodeID : number) {
        super(0x23, [nodeID, 0x00])
    }
}
