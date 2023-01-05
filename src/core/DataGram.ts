import { Events }            from '../utilities/Events'
import { DataGramDirection } from '../utilities/Enums'

export abstract class DataGram {
    /**
     * The index of the datagram that contains the direction of the transmission.
     */
    static readonly directionIndex = 3

    /**
     * The index of the datagram that contains the command ID.
     */
    static readonly commandIDIndex = 4

    /**
     * The index of the datagram that contains the data's length.
     */
    static readonly dataLengthIndex = 5

    /**
     * The index of the datagram that contains the message ID.
     */
    static readonly messageIDIndex = 7

    /**
     * The index of the datagram that contains the message data.
     */
    static readonly dataIndex = 8

    /**
     * The first 3 bytes of every `DataGram`.
     */
    protected static readonly prefix = [0x56, 0x54, 0x55]

    protected readonly buffer: number[]

    public constructor(rawBuffer?: Buffer | number[]) {
        this.buffer = rawBuffer
            ? [...rawBuffer]
            : [...(<typeof DataGram>this.constructor).prefix]
    }

    public get(index: number) {
        return this.buffer[index]
    }

    public getData(): number[] {
        return [...this.data]
    }

    protected toHexString(buffer?: number[]): string {
        buffer = buffer ?? this.buffer

        return buffer
            .map(entry => entry.toString(16).padStart(2, '0'))
            .map(octal => octal.toUpperCase())
            .join(':')
    }

    protected bufferToString(offset: number, buffer?: number[]): string {
        buffer = buffer ?? this.buffer

        return buffer
            .slice(offset)
            .filter(Boolean)
            .map(hex => String.fromCharCode(hex))
            .join('')
    }

    protected get length() {
        return this.buffer.length
    }

    get direction(): DataGramDirection {
        return this.get((<typeof DataGram>this.constructor).directionIndex)
    }

    /**
     * The checksum for the datagram.
     */
    get checksum() {
        return this.buffer.reduce((sum, curr) => (sum + curr) & 0xFF)
    }

    /**
     * The command ID for the datagram.
     */
    get commandID() {
        return this.get((<typeof DataGram>this.constructor).commandIDIndex)
    }

    /**
     * The message ID for the datagram.
     */
    get messageID() {
        return this.get((<typeof DataGram>this.constructor).messageIDIndex)
    }

    protected get data() {
        if (this.hasData) {
            return this.buffer.slice((<typeof DataGram>this.constructor).dataIndex)
        }

        return []
    }

    public get hasData() {
        return this.length > (<typeof DataGram>this.constructor).dataIndex
    }

    public get dataLength(): [number, number] {
        const length = this.data.length + 2

        return [(length >> 8) & 0xFF, length & 0xFF]
    }

    public get eventName() {
        return Events.generate(this.commandID, this.messageID)
    }

    public get commandName() {
        return this.constructor.name
    }

    protected get toLog() {
        return {}
    }

    public get logData(): object {
        return {
            command: this.commandName,
            direction: DataGramDirection[this.direction],
            commandID: this.commandID.toString(16),
            messageID: this.messageID.toString(16),
            ...this.toLog,
            raw: this.toHexString()
        }
    }
}
