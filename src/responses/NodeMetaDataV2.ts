import type { KeyType } from '../types'
import { NodeMetaData } from './NodeMetaData'

export class NodeMetaDataV2 extends NodeMetaData {
    protected static override readonly typeIndex = 18
    protected static override readonly totalKeysIndex = 19
    protected static override readonly offsetStartIndex = 20

    override get keysList() {
        return Array.from({ length: this.totalKeys }, (_, i) => ({
            id: i,
            type: this.get(this.$self.offsetStartIndex + i) as KeyType,
        }))
    }
}
