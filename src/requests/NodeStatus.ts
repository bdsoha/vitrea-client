import { type AckOutcome, BaseRequest } from '../core'
import type { KeyStatus } from '../responses'
import { CommandID } from '../types'

export class NodeStatus extends BaseRequest<KeyStatus> {
    constructor(public readonly nodeID: number) {
        super(CommandID.NodeStatus, [nodeID, 0x00])
    }

    public override get replyCommands(): readonly number[] {
        return [CommandID.KeyStatus]
    }

    public override matches(response: KeyStatus): boolean {
        return response.nodeID === this.nodeID
    }

    public override handleAck(): AckOutcome {
        return 'reject'
    }
}
