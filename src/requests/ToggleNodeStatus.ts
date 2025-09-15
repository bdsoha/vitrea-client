import type { LEDBackgroundBrightness, LockStatus } from '../types'
import { CommandID } from '../types'
import { AcknowledgeRequest } from './AcknowledgeRequest'

export class ToggleNodeStatus extends AcknowledgeRequest {
    constructor(
        nodeNo: number,
        lockStatus: LockStatus,
        ledLevel: LEDBackgroundBrightness,
    ) {
        super(CommandID.ToggleNodeStatus, [nodeNo, lockStatus, ledLevel])
    }
}
