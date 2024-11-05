import { AbstractConfigParser } from './AbstractConfigParser'

export interface ConnectionConfigs {
    host: string
    port: number
    username: string
    password: string
    version: ProtocolVersion
}

export const ProtocolVersion = {
    V1: 'v1',
    V2: 'v2'
} as const

export type ProtocolVersion = typeof ProtocolVersion[keyof typeof ProtocolVersion]

export class ConnectionConfigParser extends AbstractConfigParser<ConnectionConfigs> {
    public static create(configs: Partial<ConnectionConfigs> = {}): ConnectionConfigs {
        const instance = new this(configs)

        return {
            host:     instance.get('host', '192.168.1.23'),
            port:     Number(instance.get('port', 11501)),
            username: instance.get('username'),
            password: instance.get('password'),
            version:  instance.get('version', ProtocolVersion.V2) as ProtocolVersion,
        }
    }
}
