import {Heartbeat}                from './requests/Heartbeat'
import {WritableSocketContract}   from './socket/WritableSocketContract'
import {AbstractHeartbeatHandler} from './socket/AbstractHeartbeatHandler'

export class VitreaHeartbeatHandler extends AbstractHeartbeatHandler {
    public constructor(socket : WritableSocketContract) {
        super(3000, socket)
    }

    protected getHeartbeatDataGram() : Buffer {
        return new Heartbeat().build()
    }
}
