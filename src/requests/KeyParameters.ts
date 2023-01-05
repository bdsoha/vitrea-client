import { CommandID }   from '../responses/ResponseCodes'
import { BaseRequest } from '../core'

export class KeyParameters extends BaseRequest {
    constructor(nodeID : number, keyID : number) {
        super(CommandID.KeyParameters, [nodeID, keyID])
    }
}
