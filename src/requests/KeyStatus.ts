import { Events }      from '../utilities/Events'
import { CommandID }   from '../responses/ResponseCodes'
import { BaseRequest } from '../core'


export class KeyStatus extends BaseRequest {
    constructor(nodeID: number, keyID: number) {
        super(CommandID.KeyStatus, [nodeID, keyID])
    }

    public get eventName(): string {
        return Events.STATUS_UPDATE
    }
}
