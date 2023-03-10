export class Events {
    public static readonly STATUS_UPDATE = 'vitrea::status::update'
    public static readonly UNKNOWN_DATA = 'vitrea::data::unknown'

    public static acknowledgement(messageID: number): string {
        return this.generate(0x00, messageID)
    }

    public static generate(...keys: Array<string | number>): string {
        const toJoin = keys.map(key => key.toString(16).padStart(2, '0'))

        return `data::${toJoin.join('-')}`
    }
}
