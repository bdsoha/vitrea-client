import { BaseRequest } from '../core'
import type { KeyParameters as KeyParametersResponse } from '../responses'
import { CommandID } from '../types'

export class KeyParameters extends BaseRequest<KeyParametersResponse> {
    constructor(nodeID: number, keyID: number) {
        super(CommandID.KeyParameters, [nodeID, keyID])
    }
}
