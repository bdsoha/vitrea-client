import * as Net from 'node:net'
import { NullLogger } from '../core'
import type { SocketConfigs } from '../types'
import { AbstractConfigParser } from './AbstractConfigParser'

export class SocketConfigParser extends AbstractConfigParser<SocketConfigs> {
    public toBoolean(value: string | boolean): boolean {
        return ['1', 'true', 'TRUE', true].includes(value)
    }

    protected positive(
        key: 'heartbeatInterval' | 'requestTimeout',
        fallback: number,
    ) {
        const value = Number(this.get(key, fallback))

        if (!(value > 0)) {
            throw TypeError(`A positive value for [${key}] is required`)
        }

        return value
    }

    public static create(
        configs: Partial<SocketConfigs> = {},
    ): Required<SocketConfigs> {
        const instance = new SocketConfigParser(configs)

        return {
            log: instance.configs.log ?? new NullLogger(),
            socketSupplier:
                instance.configs.socketSupplier ?? (() => new Net.Socket()),
            shouldReconnect: instance.toBoolean(
                instance.get('shouldReconnect', true),
            ),
            heartbeatInterval: instance.positive('heartbeatInterval', 3000),
            maxRetries: Number(instance.get('maxRetries', 3)),
            requestBuffer: Number(instance.get('requestBuffer', 250)),
            requestBufferVariance: Number(
                instance.get('requestBufferVariance', 0.15),
            ),
            requestTimeout: instance.positive('requestTimeout', 1000),
        }
    }
}
