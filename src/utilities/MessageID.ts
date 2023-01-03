export class MessageID {
    static messageIDIndex = 0

    static resetID(baseID = 0x00) {
        return this.messageIDIndex = baseID
    }

    static getNextID() {
        this.messageIDIndex++

        if (this.messageIDIndex > 0xFF) {
            this.messageIDIndex = 0x01
        }

        return this.messageIDIndex
    }

    static setNextID(nextID: number) {
        this.resetID(nextID - 1)
    }
}
