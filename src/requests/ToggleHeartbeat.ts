import type { LogLevel } from '../types'
import { CommandID } from '../types'
import { AcknowledgeRequest } from './AcknowledgeRequest'

export class ToggleHeartbeat extends AcknowledgeRequest {
    static override readonly logLevel: LogLevel = 'debug'

    constructor(enable = true, unsolicited = true) {
        super(CommandID.ToggleHeartbeat, [Number(enable), Number(unsolicited)])
    }
}
