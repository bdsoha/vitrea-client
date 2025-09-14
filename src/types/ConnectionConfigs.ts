import type { ProtocolVersion } from './ProtocolVersion'

export interface ConnectionConfigs {
    host: string
    port: number
    username: string
    password: string
    version: ProtocolVersion
}
