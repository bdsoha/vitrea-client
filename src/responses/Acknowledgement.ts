import { Events }       from '../utilities/Events'
import { CommandID }    from './ResponseCodes'
import { BaseResponse } from '../core'


export class Acknowledgement extends BaseResponse {
    public static eventName(messageID: number) {
        return Events.generate(CommandID.Acknowledgement, messageID)
    }
}
