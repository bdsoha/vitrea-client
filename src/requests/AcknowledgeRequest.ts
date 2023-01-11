import { BaseRequest } from '../core'
import { Events }      from '../utilities/Events'


export class AcknowledgeRequest extends BaseRequest {
    public get eventName(): string {
        return Events.acknowledgement(this.messageID)
    }
}
