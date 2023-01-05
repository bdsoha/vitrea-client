import { KeyCategory }  from '../utilities/Enums'
import { BaseResponse } from '../core'


export class KeyParameters extends BaseResponse {
    protected static readonly nodeIDIndex = 8
    protected static readonly keyIDIndex = 9
    protected static readonly categoryIndex = 11
    protected static readonly nameIndex = 21
    protected static readonly hiddenRegex = /\(?MW\)?$/i
    protected static readonly sceneRegex = /\(?SCENE\)?$/i

    public get name() {
        return this.bufferToString(this.$self.nameIndex)
    }

    public get nodeID(): number {
        return this.get(this.$self.nodeIDIndex)
    }

    public get keyID() {
        return this.get(this.$self.keyIDIndex)
    }

    public get isHidden(): boolean {
        return this.$self.hiddenRegex.test(this.name)
            || this.name === 'EMPTY'
    }

    public get isScene(): boolean {
        return this.$self.sceneRegex.test(this.name)
    }

    public get category(): KeyCategory {
        return this.get(this.$self.categoryIndex)
    }

    protected get toLog() {
        return {
            ...super.toLog,
            name:     this.name,
            nodeID:   this.nodeID,
            keyID:    this.keyID,
            category: KeyCategory[this.category],
            hidden:   this.isHidden,
        }
    }
}
