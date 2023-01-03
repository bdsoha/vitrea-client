import { KeyCategory } from '../utilities/Enums'
import { BaseResponse } from './BaseResponse'


export class KeyParameters extends BaseResponse {
    protected static readonly nodeIDIndex = 8
    protected static readonly keyIDIndex = 9
    protected static readonly categoryIndex = 11
    protected static readonly nameIndex = 21
    protected static readonly hiddenRegex = /\(?MW\)?$/i
    protected static readonly sceneRegex = /\(?SCENE\)?$/i

    public get name() {
        return this.bufferToString(
            (<typeof KeyParameters>this.constructor).nameIndex
        )
    }

    public get nodeID(): number {
        return this.get((<typeof KeyParameters>this.constructor).nodeIDIndex)
    }

    public get keyID() {
        return this.get((<typeof KeyParameters>this.constructor).keyIDIndex)
    }

    public get isHidden(): boolean {
        return (<typeof KeyParameters>this.constructor).hiddenRegex.test(this.name)
            || this.name === 'EMPTY'
    }

    public get isScene(): boolean {
        return (<typeof KeyParameters>this.constructor).sceneRegex.test(this.name)
    }

    public get category(): KeyCategory {
        return this.get((<typeof KeyParameters>this.constructor).categoryIndex)
    }

    protected get toLog() {
        return {
            ...super.toLog,
            name: this.name,
            nodeID: this.nodeID,
            keyID: this.keyID,
            category: KeyCategory[this.category],
            hidden: this.isHidden,
        }
    }
}
