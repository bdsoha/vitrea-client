import type { KeyPowerStatus, Ratio } from '../types'
import { CommandID } from '../types'
import { AcknowledgeRequest } from './AcknowledgeRequest'

const toByteArray = (seconds: number) => [(seconds >> 8) & 0xff, seconds & 0xff]

export class ToggleKeyStatus extends AcknowledgeRequest {
    constructor(
        nodeID: number,
        keyID: number,
        status: KeyPowerStatus,
        {
            dimmerRatio = 0,
            timer = 0,
        }: Partial<{ dimmerRatio: Ratio<101>; timer: number }> = {},
    ) {
        super(CommandID.ToggleKeyStatus, [
            nodeID,
            keyID,
            status,
            dimmerRatio,
            ...toByteArray(timer),
        ])
    }
}
