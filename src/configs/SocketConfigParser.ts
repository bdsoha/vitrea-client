import { AbstractConfigParser }       from './AbstractConfigParser'
import { LoggerContract, NullLogger } from '../core'
import * as Net                       from 'node:net'

export interface SocketConfigs {
    log: LoggerContract,
    ignoreAckLogs: boolean
    shouldReconnect: boolean
    requestBuffer: number
    requestBufferVariance: number
    requestTimeout: number
    heartbeatInterval: number

    socketSupplier(): Net.Socket
}

export class SocketConfigParser extends AbstractConfigParser<SocketConfigs> {
    public toBoolean(value: string | boolean): boolean {
        return ['1', 'true', 'TRUE', true].includes(value)
    }

    public static create(configs: Partial<SocketConfigs> = {}): Required<SocketConfigs> {
        const instance = new this(configs)

        return {
            log:                   instance.configs.log ?? new NullLogger(),
            socketSupplier:        instance.configs.socketSupplier ?? (() => new Net.Socket()),
            ignoreAckLogs:         instance.toBoolean(instance.get('ignoreAckLogs', false)),
            shouldReconnect:       instance.toBoolean(instance.get('shouldReconnect', true)),
            requestBuffer:         Number(instance.get('requestBuffer', 250)),
            requestBufferVariance: Number(instance.get('requestBufferVariance', 0.15)),
            requestTimeout:        Number(instance.get('requestTimeout', 1000)),
            heartbeatInterval:     Number(instance.get('heartbeatInterval', 3000)),
        }
    }
}
