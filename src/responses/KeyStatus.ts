import { BaseResponse } from '../core'
import { KeyPowerStatus } from '../types'
import { Events } from '../utilities/Events'

export class KeyStatus extends BaseResponse {
    protected static readonly nodeIDIndex = 8
    protected static readonly keyIDIndex = 9
    protected static readonly powerIndex = 10

    get nodeID() {
        return this.get(this.$self.nodeIDIndex)
    }

    get keyID() {
        return this.get(this.$self.keyIDIndex)
    }

    get power(): KeyPowerStatus {
        return this.get(this.$self.powerIndex) as KeyPowerStatus
    }

    get isOn() {
        return this.power === KeyPowerStatus.ON
    }

    get isOff() {
        return this.power === KeyPowerStatus.OFF
    }

    get isReleased() {
        return this.power === KeyPowerStatus.RELEASED
    }

    protected get powerName(): string {
        const entry = Object.entries(KeyPowerStatus).find(
            ([, value]) => value === this.power,
        )

        return entry ? entry[0] : this.toHex(this.power)
    }

    protected override get toLog() {
        return {
            ...super.toLog,
            nodeID: this.nodeID,
            keyID: this.keyID,
            power: this.powerName,
        }
    }

    public override get eventName(): string {
        return Events.STATUS_UPDATE
    }
}
