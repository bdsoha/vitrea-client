import { AcknowledgeRequest } from './AcknowledgeRequest'

export class ToggleHeartbeat extends AcknowledgeRequest {
    constructor(enable = true, unsolicited = true) {
        super(0x08, [Number(enable), Number(unsolicited)])
    }
}
