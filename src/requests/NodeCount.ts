import {BaseRequest} from './BaseRequest'
import {CommandID}   from '../responses/ResponseCodes'


export class NodeCount extends BaseRequest {
    constructor() {
        super(CommandID.NodeCount)
    }
}
