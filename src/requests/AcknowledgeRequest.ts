import { BaseRequest } from '../core'
import type { Acknowledgement } from '../responses'
import { CommandID } from '../types'

export abstract class AcknowledgeRequest extends BaseRequest<Acknowledgement> {
    public override get replyCommands(): readonly number[] {
        return [CommandID.Acknowledgement]
    }
}
