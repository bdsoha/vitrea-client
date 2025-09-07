import { Heartbeat }                from '../requests'
import { BaseRequest }              from '../core'
import { RequestSenderContract }    from './RequestSenderContract'
import { AbstractHeartbeatHandler } from './AbstractHeartbeatHandler'

export class VitreaHeartbeatHandler extends AbstractHeartbeatHandler {
    public constructor(interval: number, socket : RequestSenderContract) {
        super(interval, socket)
    }

    protected getHeartbeatRequest<T extends BaseRequest>(): T {
        return new Heartbeat() as T
    }

    public static create(interval: number, socket : RequestSenderContract) {
        const instance = new this(interval, socket)

        instance.restart()

        return instance
    }
}
