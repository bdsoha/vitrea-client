// biome-ignore lint/complexity/noStaticOnlyClass: Static utility class pattern is intentional
export class MessageID {
    static messageIDIndex = 0

    static resetID(baseID = 0x00): void {
        MessageID.messageIDIndex = baseID
    }

    static getNextID(): number {
        MessageID.messageIDIndex++

        if (MessageID.messageIDIndex > 0xff) {
            MessageID.messageIDIndex = 0x01
        }

        return MessageID.messageIDIndex
    }

    static setNextID(nextID: number) {
        MessageID.resetID(nextID - 1)
    }
}
