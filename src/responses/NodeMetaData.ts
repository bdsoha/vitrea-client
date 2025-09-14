import { BaseResponse } from '../core'
import {
    type KeyType,
    type LEDBackgroundBrightness,
    LockStatus,
    NodeType,
} from '../utilities/Enums'

export class NodeMetaData extends BaseResponse {
    protected static readonly idIndex = 8
    protected static readonly macAddressIndex = 9
    protected static readonly typeIndex: number = 17
    protected static readonly totalKeysIndex: number = 18
    protected static readonly offsetStartIndex: number = 19
    protected static readonly rawLockedStateIndex = 0
    protected static readonly rawLEDLevelIndex = 1
    protected static readonly rawVersionIndex = 3
    protected static readonly rawRoomIDIndex = 7

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

    get type(): NodeType {
        return this.get(this.$self.typeIndex) as NodeType
    }

    get model(): string {
        const modelEntry = Object.entries(NodeType).find(
            ([, value]) => value === this.type,
        )

        return modelEntry
            ? modelEntry[0].replace(/_/g, '-')
            : `Unknown-${this.type}`
    }

    get version() {
        const offset = this.offset(this.$self.rawVersionIndex)
        const [version, subversion, patch] = this.buffer.slice(
            offset,
            offset + 3,
        )

        return `${version}.${subversion}${patch}`
    }

    get macAddress() {
        const start = this.$self.macAddressIndex

        return this.toHexString(this.buffer.slice(start, start + 8))
    }

    get totalKeys() {
        return this.get(this.$self.totalKeysIndex)
    }

    get keysList() {
        return Array.from({ length: this.totalKeys }, (_, i) => ({
            id: i,
            type: this.atOffset(i) as KeyType,
        }))
    }

    get isLocked() {
        const byIndex = this.$self.rawLockedStateIndex

        return this.atOffset(byIndex) === LockStatus.LOCKED
    }

    get ledLevel(): LEDBackgroundBrightness {
        return this.atOffset(
            this.$self.rawLEDLevelIndex,
        ) as LEDBackgroundBrightness
    }

    protected override get toLog() {
        return {
            ...super.toLog,
            nodeID: this.id,
            totalKeys: this.totalKeys,
            isLocked: this.isLocked,
            keysList: this.keysList,
            type: this.type,
            model: this.model,
            version: this.version,
            macAddress: this.macAddress,
            ledLevel: this.ledLevel,
        }
    }
}
