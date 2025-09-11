import { BaseRequest, BaseResponse } from '../core'


export interface RequestSenderContract {
    send<T extends BaseRequest>(request: T): Promise<BaseResponse>
}
