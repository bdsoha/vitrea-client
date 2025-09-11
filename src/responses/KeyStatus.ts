import { Events }         from '../utilities/Events'
import { BaseResponse }   from '../core'
import { KeyPowerStatus } from '../utilities/Enums'


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

    public get eventName(): string {
        return Events.STATUS_UPDATE
    }
}
