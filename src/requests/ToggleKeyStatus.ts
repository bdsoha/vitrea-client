import { Events }         from '../utilities/Events'
import { BaseRequest }    from '../core'
import { KeyPowerStatus } from '../utilities/Enums'


export class ToggleKeyStatus extends BaseRequest {
    constructor(nodeID : number, keyID : number, status : KeyPowerStatus) {
        super(0x28, [nodeID, keyID, status, 0x00, 0x00, 0x00])
    }

    public get eventName() : string {
        return Events.acknowledgement(this.messageID)
    }
}
