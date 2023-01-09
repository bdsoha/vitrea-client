import { BaseResponse }                        from '../core'
import { LEDBackgroundBrightness, LockStatus } from '../utilities/Enums'


export class NodeMetaData extends BaseResponse {
    protected static readonly idIndex                  = 8
    protected static readonly macAddressIndex          = 9
    protected static readonly totalKeysIndex: number   = 18
    protected static readonly offsetStartIndex: number = 19
    protected static readonly rawLockedStateIndex      = 0
    protected static readonly rawLEDLevelIndex         = 1
    protected static readonly rawVersionIndex          = 3
    protected static readonly rawRoomIDIndex           = 7

    protected offset(byIndex: number) {
        return this.$self.offsetStartIndex + this.totalKeys + byIndex
    }

    protected atOffset(byIndex: number) {
        return this.get(this.offset(byIndex))
    }

    get id() {
        return this.get(this.$self.idIndex)
    }

    get roomID() {
        return this.atOffset(this.$self.rawRoomIDIndex)
    }

    get version() {
        const offset = this.offset(this.$self.rawVersionIndex)
        const [version, subversion, patch] = this.buffer.slice(offset, offset + 3)
        return `${version}.${subversion}${patch}`
    }

    get macAddress() {
        const start = this.$self.macAddressIndex

        return this.toHexString(
            this.buffer.slice(start, start + 8)
        )
    }

    get totalKeys() {
        return this.get(this.$self.totalKeysIndex)
    }

    get keysList() {
        return [...Array(this.totalKeys)].map((_, i) => ({
            id:   i,
            type: this.atOffset(i),
        }))
    }

    get isLocked() {
        const byIndex = this.$self.rawLockedStateIndex

        return this.atOffset(byIndex) === LockStatus.LOCKED
    }

    get ledLevel(): LEDBackgroundBrightness {
        return this.atOffset(this.$self.rawLEDLevelIndex) as LEDBackgroundBrightness
    }

    protected get toLog() {
        return {
            ...super.toLog,
            nodeID:     this.id,
            totalKeys:  this.totalKeys,
            isLocked:   this.isLocked,
            keysList:   this.keysList,
            version:    this.version,
            macAddress: this.macAddress,
            ledLevel:   this.ledLevel
        }
    }
}
