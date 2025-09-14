import * as Net from 'node:net'
import { NullLogger } from '../core'
import type { SocketConfigs } from '../types'
import { AbstractConfigParser } from './AbstractConfigParser'

export class SocketConfigParser extends AbstractConfigParser<SocketConfigs> {
    public toBoolean(value: string | boolean): boolean {
        return ['1', 'true', 'TRUE', true].includes(value)
    }

    public static create(
        configs: Partial<SocketConfigs> = {},
    ): Required<SocketConfigs> {
        const instance = new SocketConfigParser(configs)

        return {
            log: instance.configs.log ?? new NullLogger(),
            socketSupplier:
                instance.configs.socketSupplier ?? (() => new Net.Socket()),
            ignoreAckLogs: instance.toBoolean(
                instance.get('ignoreAckLogs', false),
            ),
            shouldReconnect: instance.toBoolean(
                instance.get('shouldReconnect', true),
            ),
            heartbeatInterval: Number(instance.get('heartbeatInterval', 3000)),
            maxRetries: Number(instance.get('maxRetries', 3)),
            requestBuffer: Number(instance.get('requestBuffer', 250)),
            requestBufferVariance: Number(
                instance.get('requestBufferVariance', 0.15),
            ),
            requestTimeout: Number(instance.get('requestTimeout', 1000)),
        }
    }
}
