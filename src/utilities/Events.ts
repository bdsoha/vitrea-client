export class Events {
    public static readonly STATUS_UPDATE = 'vitrea::status::update'

    public static generate(...keys: any[]) : string {
        const toJoin = keys.map(key => key.toString(16).padStart(2, '0'))

        return `data::${toJoin.join('-')}`
    }
}
