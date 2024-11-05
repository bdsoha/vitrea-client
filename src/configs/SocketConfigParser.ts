import { AbstractConfigParser }       from './AbstractConfigParser'
import { LoggerContract, NullLogger } from '../core'
import * as Net                       from 'net'

export interface SocketConfigs {
    log: LoggerContract,
    shouldReconnect: boolean
    requestTimeout: number

    socketSupplier(): Net.Socket
}

export class SocketConfigParser extends AbstractConfigParser<SocketConfigs> {
    public toBoolean(value: string | boolean): boolean {
        return ['1', 'true', 'TRUE', true].includes(value)
    }

    public static create(configs: Partial<SocketConfigs> = {}): Required<SocketConfigs> {
        const instance = new this(configs)

        return {
            log:             instance.configs.log ?? new NullLogger(),
            socketSupplier:  instance.configs.socketSupplier ?? (() => new Net.Socket()),
            shouldReconnect: instance.toBoolean(instance.get('shouldReconnect', true)),
            requestTimeout:  Number(instance.get('requestTimeout', 1000))
        }
    }
}
