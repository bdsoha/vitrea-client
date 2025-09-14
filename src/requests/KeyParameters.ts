import { BaseRequest } from '../core'
import { CommandID } from '../types'

export class KeyParameters extends BaseRequest {
    constructor(nodeID: number, keyID: number) {
        super(CommandID.KeyParameters, [nodeID, keyID])
    }
}
