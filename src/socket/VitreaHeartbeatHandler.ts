import {Heartbeat}                from '../requests/Heartbeat'
import {WritableSocketContract}   from './WritableSocketContract'
import {AbstractHeartbeatHandler} from './AbstractHeartbeatHandler'

export class VitreaHeartbeatHandler extends AbstractHeartbeatHandler {
    public constructor(socket : WritableSocketContract) {
        super(3000, socket)
    }

    protected getHeartbeatDataGram() : Buffer {
        return new Heartbeat().build()
    }

    public static create(socket : WritableSocketContract) {
        const instance = new this(socket)

        instance.restart()

        return instance
    }
}
