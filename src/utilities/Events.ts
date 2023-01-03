export class Events {
    public static readonly STATUS_UPDATE = 'vitrea::status::update'

    public static generate(...keys: any[]) : string {
        return `vitrea::${keys.join('-')}`
    }
}