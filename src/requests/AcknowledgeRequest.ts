import { BaseRequest } from '../core'
import { Events } from '../utilities/Events'

export abstract class AcknowledgeRequest extends BaseRequest {
    public override get eventName(): string {
        return Events.acknowledgement(this.messageID)
    }
}
