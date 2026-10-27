import type { BaseRequest, BaseResponse } from '../core'
import { RequestRejectedException } from '../exceptions'
import { Acknowledgement } from '../responses'
import type { ProtocolVersion } from '../types'

type Pending = {
    request: BaseRequest
    resolve(response: BaseResponse): void
    reject(error: Error): void
}

export class PendingRequests {
    protected readonly pending = new Map<number, Pending>()

    public constructor(protected readonly version: ProtocolVersion) {}

    public wait<R extends BaseResponse>(request: BaseRequest<R>): Promise<R> {
        return new Promise<R>((resolve, reject) => {
            this.pending.set(request.messageID, {
                request,
                resolve: resolve as Pending['resolve'],
                reject,
            })
        })
    }

    public forget(request: BaseRequest) {
        if (this.pending.get(request.messageID)?.request === request) {
            this.pending.delete(request.messageID)
        }
    }

    public settle(response: BaseResponse) {
        const entry = this.pending.get(response.messageID)

        if (!entry) {
            return
        }

        const { request } = entry

        if (
            request.replyCommands.includes(response.commandID)
            && request.matches(response)
        ) {
            this.pending.delete(response.messageID)
            entry.resolve(response)

            return
        }

        if (
            response instanceof Acknowledgement
            && request.handleAck(response, this.version) === 'reject'
        ) {
            this.pending.delete(response.messageID)
            entry.reject(new RequestRejectedException(response))
        }
    }
}
