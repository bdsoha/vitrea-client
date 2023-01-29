import { Events } from '../utilities/Events'
import { BaseRequest } from '../core'
import { KeyPowerStatus } from '../utilities/Enums'


type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Range<T, [R['length'], ...R]>
type Ratio<T extends number> = number extends T ? number : _Range<T, []>

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
