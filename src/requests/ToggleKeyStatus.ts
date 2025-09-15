import { BaseRequest } from '../core'
import type { KeyPowerStatus, Ratio } from '../types'
import { Events } from '../utilities/Events'

const toByteArray = (seconds: number) => [(seconds >> 8) & 0xff, seconds & 0xff]

export class ToggleKeyStatus extends BaseRequest {
    constructor(
        nodeID: number,
        keyID: number,
        status: KeyPowerStatus,
        options: Partial<{ dimmerRatio: Ratio<101>; timer: number }> = {
            dimmerRatio: 0,
            timer: 0,
        },
    ) {
        super(0x28, [
            nodeID,
            keyID,
            status,
            options.dimmerRatio,
            ...toByteArray(options.timer),
        ])
    }

    public override get eventName(): string {
        return Events.acknowledgement(this.messageID)
    }
}
