import { DataGramDirection }                  from '../../utilities/Enums'
import { BaseResponse, DataGram }             from '../../core'
import { CommandID, ProtocolVersion }         from '../../types'
import { ResponseLookupV1, ResponseLookupV2 } from './ResponseLookup'


export class ResponseFactory {
    protected static readonly lookupTable = {
        [ProtocolVersion.V1]: ResponseLookupV1,
        [ProtocolVersion.V2]: ResponseLookupV2,
    }

    protected static isIncoming(rawBuffer: Buffer): boolean {
        return rawBuffer[DataGram.directionIndex] === DataGramDirection.INCOMING
    }

    protected static lookup(rawBuffer: Buffer, version: ProtocolVersion) {
        const commandID = rawBuffer[DataGram.commandIDIndex] as CommandID

        return this.lookupTable[version][commandID]
    }

    static find<T extends BaseResponse>(rawBuffer: Buffer, version: ProtocolVersion): T | undefined {
        if (!this.isIncoming(rawBuffer)) {
            return undefined
        }

        const supplier = this.lookup(rawBuffer, version)

        if (supplier) {
            const instance = new supplier(rawBuffer)

            return instance.hasValidChecksum ? (instance as T) : undefined
        }

        return undefined
    }
}
