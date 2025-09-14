import type { BaseRequest } from '../core'
import { Heartbeat } from '../requests'
import { AbstractHeartbeatHandler } from './AbstractHeartbeatHandler'
import type { RequestSenderContract } from './RequestSenderContract'

export class VitreaHeartbeatHandler extends AbstractHeartbeatHandler {
    protected getHeartbeatRequest<T extends BaseRequest>(): T {
        return new Heartbeat() as T
    }

    public static create(interval: number, socket: RequestSenderContract) {
        const instance = new VitreaHeartbeatHandler(interval, socket)

        instance.restart()

        return instance
    }
}
