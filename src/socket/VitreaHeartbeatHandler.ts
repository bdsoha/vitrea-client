import { Heartbeat }                from '../requests'
import { BaseRequest }              from '../core'
import { RequestSenderContract }    from './RequestSenderContract'
import { AbstractHeartbeatHandler } from './AbstractHeartbeatHandler'

export class VitreaHeartbeatHandler extends AbstractHeartbeatHandler {
    public constructor(socket : RequestSenderContract) {
        super(3000, socket)
    }

    protected getHeartbeatRequest<T extends BaseRequest>(): T {
        return new Heartbeat() as T
    }

    public static create(socket : RequestSenderContract) {
        const instance = new this(socket)

        instance.restart()

        return instance
    }
}
