import type { LogMeta } from '../types'
import { DataGramDirection } from '../types'
import { Events } from '../utilities/Events'

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
        this.buffer = rawBuffer ? [...rawBuffer] : [...this.$self.prefix]
    }

    public get(index: number) {
        return this.buffer[index]
    }

    public getData(): number[] {
        return [...this.data]
    }

    // biome-ignore lint/suspicious/noExplicitAny: Magic
    protected get $self(): Record<string, any> {
        return this.constructor
    }

    protected toHex(number: number): string {
        const formatted = number.toString(16).padStart(2, '0').toUpperCase()

        return ['0x', formatted].join('')
    }

    protected toHexString(buffer?: number[]): string {
        buffer = buffer ?? this.buffer

        return buffer
            .map(entry => this.toHex(entry).replace('0x', ''))
            .join(':')
    }

    protected bufferToString(offset: number): string {
        const slice = this.buffer.slice(offset)

        return Buffer.from(slice).toString('utf16le')
    }

    protected get length() {
        return this.buffer.length
    }

    get direction(): DataGramDirection {
        return this.get(this.$self.directionIndex) as DataGramDirection
    }

    /**
     * The checksum for the datagram.
     */
    get checksum() {
        return this.buffer.reduce((sum, curr) => (sum + curr) & 0xff)
    }

    /**
     * The command ID for the datagram.
     */
    get commandID() {
        return this.get(this.$self.commandIDIndex)
    }

    /**
     * The message ID for the datagram.
     */
    get messageID() {
        return this.get(this.$self.messageIDIndex)
    }

    protected get data() {
        if (this.hasData) {
            return this.buffer.slice(this.$self.dataIndex)
        }

        return []
    }

    public get hasData() {
        return this.length > this.$self.dataIndex
    }

    public get dataLength(): [number, number] {
        const length = this.data.length + 2

        return [(length >> 8) & 0xff, length & 0xff]
    }

    public get eventName() {
        return Events.generate(this.commandID, this.messageID)
    }

    public get commandName() {
        return this.$self.name
    }

    protected get toLog() {
        return {}
    }

    public get logData(): LogMeta {
        return {
            command: this.commandName,
            direction:
                DataGramDirection.INCOMING === this.direction
                    ? 'Incoming'
                    : 'Outgoing',
            commandID: this.toHex(this.commandID),
            messageID: this.toHex(this.messageID),
            ...this.toLog,
            raw: this.toHexString(),
        }
    }
}
