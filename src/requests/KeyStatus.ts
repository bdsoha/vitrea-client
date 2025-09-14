import { Events }      from '../utilities/Events'
import { CommandID }   from '../types'
import { BaseRequest } from '../core'


export class KeyStatus extends BaseRequest {
    constructor(nodeID: number, keyID: number) {
        super(CommandID.KeyStatus, [nodeID, keyID])
    }

    public override get eventName(): string {
        return Events.STATUS_UPDATE
    }
}
