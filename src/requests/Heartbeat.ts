import type { LogLevel } from '../types'
import { CommandID } from '../types'
import { AcknowledgeRequest } from './AcknowledgeRequest'

export class Heartbeat extends AcknowledgeRequest {
    static override readonly logLevel: LogLevel = 'debug'

    constructor() {
        super(CommandID.Heartbeat)
    }
}
