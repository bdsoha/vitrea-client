import { AbstractConfigParser }               from './AbstractConfigParser'
import { ConnectionConfigs, ProtocolVersion } from '../types'


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
