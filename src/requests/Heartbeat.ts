import {AcknowledgeRequest} from './AcknowledgeRequest'

export class Heartbeat extends AcknowledgeRequest {
    constructor() {
        super(0x07)
    }
}
