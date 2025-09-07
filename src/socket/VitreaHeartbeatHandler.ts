import { Heartbeat }                from '../requests'
import { BaseRequest }              from '../core'
import { RequestSenderContract }    from './RequestSenderContract'
import { AbstractHeartbeatHandler } from './AbstractHeartbeatHandler'

export class VitreaHeartbeatHandler extends AbstractHeartbeatHandler {
    public constructor(socket : RequestSenderContract, interval: number) {
        super(interval, socket)
    }

    protected getHeartbeatRequest<T extends BaseRequest>(): T {
        return new Heartbeat() as T
    }

    public static create(socket : RequestSenderContract, interval: number) {
        const instance = new this(socket, interval)

        instance.restart()

        return instance
    }
}
