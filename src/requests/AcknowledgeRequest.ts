import { Events }      from '../utilities/Events'
import { CommandID }   from '../responses/ResponseCodes'
import { BaseRequest } from '../core'

export class AcknowledgeRequest extends BaseRequest {
    public get eventName() : string {
        return Events.generate(CommandID.Acknowledgement, this.messageID)
    }
}
