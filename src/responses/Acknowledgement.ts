import { CommandID }    from './ResponseCodes'
import { BaseResponse } from '../core'
import { Events } from '../utilities/Events'


export class Acknowledgement extends BaseResponse {
    public static eventName(messageID: number) {
        return Events.generate(CommandID.Acknowledgement, messageID)
    }
}
