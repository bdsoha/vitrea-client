export type VBoxConfigs = {
    host: string,
    port?: number,
    username: string,
    password: string
}

export class VBoxConnection {
    public static create(configs: Partial<VBoxConfigs> = {}) : Required<VBoxConfigs> {
        const host = configs.host ?? process.env.VITREA_VBOX_HOST ?? '192.168.1.23'
        const port = configs.port ?? process.env.VITREA_VBOX_PORT ?? 11501
        const username = configs.username ?? process.env.VITREA_VBOX_USERNAME ?? null
        const password = configs.password ?? process.env.VITREA_VBOX_PASSWORD ?? null

        if (!host) {
            throw TypeError('Host is required')
        }

        if (!username) {
            throw TypeError('Device is required')
        }

        if (!password) {
            throw TypeError('Device is required')
        }

        return {
            host,
            port: Number.parseInt(String(port)),
            username,
            password
        }
    }
}