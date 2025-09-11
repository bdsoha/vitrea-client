import { CommandID }                           from '../types'
import { AcknowledgeRequest }                  from './AcknowledgeRequest'
import { LEDBackgroundBrightness, LockStatus } from '../utilities/Enums'


export class ToggleNodeStatus extends AcknowledgeRequest {
    constructor(nodeNo: number, lockStatus: LockStatus, ledLevel: LEDBackgroundBrightness) {
        super(CommandID.ToggleNodeStatus, [nodeNo, lockStatus, ledLevel])
    }
}
