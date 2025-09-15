import type { KeyType } from '../types'
import { NodeMetaData } from './NodeMetaData'

export class NodeMetaDataV2 extends NodeMetaData {
    protected static readonly typeIndex = 18
    protected static readonly totalKeysIndex = 19
    protected static readonly offsetStartIndex = 20

    get keysList() {
        return Array.from({ length: this.totalKeys }, (_, i) => ({
            id: i,
            type: this.get(this.$self.offsetStartIndex + i) as KeyType,
        }))
    }
}
