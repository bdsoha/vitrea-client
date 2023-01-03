import { CommandID }    from './ResponseCodes'
import { BaseResponse } from './BaseResponse'
import { Events } from '../utilities/Events'


export class Acknowledgement extends BaseResponse {
    public static eventName(messageID: number) {
        return Events.generate(CommandID.Acknowledgement, messageID)
    }
}
