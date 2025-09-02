import { BaseRequest, BaseResponse } from '../core'

export interface RequestSenderContract {
    send<T extends BaseRequest, R extends BaseResponse>(request: T): Promise<R>
}
