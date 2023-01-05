export type VBoxConfigs = {
    host: string,
    port?: number,
    username: string,
    password: string
}

export class VBoxConnection {
    protected static get<T extends keyof VBoxConfigs>(
        configs: Partial<VBoxConfigs>,
        key: T,
        fallback: any = null,
    ) {
        const found = configs[key] ?? process.env[`VITREA_VBOX_${key.toUpperCase()}`] ?? fallback

        if (!found) {
            throw TypeError(`A value for [${key}] is required`)
        }

        return found
    }

    public static create(configs: Partial<VBoxConfigs> = {}) : Required<VBoxConfigs> {
        return {
            host:     this.get(configs, 'host', '192.168.1.23'),
            port:     Number(this.get(configs, 'port', 11501)),
            username: this.get(configs, 'username'),
            password: this.get(configs, 'password')
        }
    }
}