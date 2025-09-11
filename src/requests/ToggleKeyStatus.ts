import { Ratio }          from '../types'
import { Events }         from '../utilities/Events'
import { BaseRequest }    from '../core'
import { KeyPowerStatus } from '../utilities/Enums'


const toByteArray = (seconds: number) => [seconds >> 8 & 0xFF, seconds & 0xFF]

export class ToggleKeyStatus extends BaseRequest {
    constructor(
        nodeID: number,
        keyID: number,
        status: KeyPowerStatus,
        options: Partial<{ dimmerRatio: Ratio<101>, timer: number }> = { dimmerRatio: 0, timer: 0 }
    ) {
        super(0x28, [nodeID, keyID, status, options.dimmerRatio, ...toByteArray(options.timer)])
    }

    public get eventName(): string {
        return Events.acknowledgement(this.messageID)
    }
}
