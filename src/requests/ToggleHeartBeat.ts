import {AcknowledgeRequest} from './AcknowledgeRequest'


export class ToggleHeartBeat extends AcknowledgeRequest {
    constructor(enable = true, unsolicited = true) {
        super(0x08, [Number(enable), Number(unsolicited)])
    }
}
