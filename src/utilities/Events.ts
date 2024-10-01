export class Events {
    public static readonly STATUS_UPDATE: string = 'vitrea::status::update'
    public static readonly UNKNOWN_DATA: string = 'vitrea::data::unknown'

    public static acknowledgement(messageID: number): string {
        return this.generate(0x00, messageID)
    }

    public static generate(...keys: string[] | number[]): string {
        const toJoin = keys.map(key => key.toString(16).padStart(2, '0'))

        return `data::${toJoin.join('-')}`
    }
}
