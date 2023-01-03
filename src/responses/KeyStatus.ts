import { BaseResponse } from './BaseResponse'
import { KeyPowerStatus } from '../utilities/Enums'
import { Events } from '../utilities/Events'


export class KeyStatus extends BaseResponse {
    protected static readonly nodeIDIndex = 8
    protected static readonly keyIDIndex  = 9
    protected static readonly powerIndex  = 10

    get nodeID() {
        return this.get((<typeof KeyStatus>this.constructor).nodeIDIndex)
    }

    get keyID() {
        return this.get((<typeof KeyStatus>this.constructor).keyIDIndex)
    }

    get power(): KeyPowerStatus {
        return this.get((<typeof KeyStatus>this.constructor).powerIndex)
    }

    get isOn() {
        return this.power === KeyPowerStatus.ON
    }

    get isOff() {
        return this.power === KeyPowerStatus.OFF
    }

    public get eventName(): string {
        return Events.STATUS_UPDATE
    }
}
