export class MessageIdSequence {
    protected current = 0x00

    public next(): number {
        this.current = this.current >= 0xff ? 0x01 : this.current + 1

        return this.current
    }
}
