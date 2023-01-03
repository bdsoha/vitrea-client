import {CommandID}   from '../responses/ResponseCodes'
import { Events } from '../utilities/Events'
import {BaseRequest} from './BaseRequest'


export class KeyStatus extends BaseRequest {
    constructor(nodeID : number, keyID : number) {
        super(CommandID.KeyStatus, [nodeID, keyID])
    }

    public get eventName() : string {
        return Events.STATUS_UPDATE
    }
}
