import { Events }      from '../utilities/Events'
import { BaseRequest } from '../core'


export class AcknowledgeRequest extends BaseRequest {
    public get eventName(): string {
        return Events.acknowledgement(this.messageID)
    }
}
