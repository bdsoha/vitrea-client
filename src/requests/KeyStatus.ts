import { BaseRequest } from '../core'
import { CommandID } from '../types'
import { Events } from '../utilities/Events'

export class KeyStatus extends BaseRequest {
    constructor(nodeID: number, keyID: number) {
        super(CommandID.KeyStatus, [nodeID, keyID])
    }

    public override get eventName(): string {
        return Events.STATUS_UPDATE
    }
}
