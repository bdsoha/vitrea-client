import { CommandID }   from '../types'
import { BaseRequest } from '../core'


export class KeyParameters extends BaseRequest {
    constructor(nodeID : number, keyID : number) {
        super(CommandID.KeyParameters, [nodeID, keyID])
    }
}
