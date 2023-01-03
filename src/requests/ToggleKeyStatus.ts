import {BaseRequest}     from './BaseRequest'
import {KeyPowerStatus}  from '../utilities/Enums'
import {Acknowledgement} from '../responses'

/** @vbox {SetKeyStatusCommand} */
export class ToggleKeyStatus extends BaseRequest {
    constructor(nodeID : number, keyID : number, status : KeyPowerStatus) {
        super(0x28, [nodeID, keyID, status, 0x00, 0x00, 0x00])
    }

    public get eventName() : string {
        return Acknowledgement.eventName(this.messageID)
    }
}
