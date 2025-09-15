import { BaseResponse } from '../core'
import type { KeyCategory } from '../types'

export class KeyParameters extends BaseResponse {
    protected static readonly nodeIDIndex = 8
    protected static readonly keyIDIndex = 9
    protected static readonly categoryIndex = 11
    protected static readonly nameIndex: number = 20

    public get name() {
        return this.bufferToString(this.$self.nameIndex)
    }

    public get nodeID(): number {
        return this.get(this.$self.nodeIDIndex)
    }

    public get keyID() {
        return this.get(this.$self.keyIDIndex)
    }

    public get category(): KeyCategory {
        return this.get(this.$self.categoryIndex) as KeyCategory
    }

    protected override get toLog() {
        return {
            ...super.toLog,
            name: this.name,
            nodeID: this.nodeID,
            keyID: this.keyID,
            category: this.category,
        }
    }
}
