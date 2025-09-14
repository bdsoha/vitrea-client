import { type BaseResponse, DataGram } from '../../core'
import { type CommandID, ProtocolVersion } from '../../types'
import { DataGramDirection } from '../../utilities/Enums'
import { ResponseLookupV1, ResponseLookupV2 } from './ResponseLookup'

// biome-ignore lint/complexity/noStaticOnlyClass: Static utility class pattern is intentional
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

        return ResponseFactory.lookupTable[version][commandID]
    }

    static find<T extends BaseResponse>(
        rawBuffer: Buffer,
        version: ProtocolVersion,
    ): T | undefined {
        if (!ResponseFactory.isIncoming(rawBuffer)) {
            return undefined
        }

        const supplier = ResponseFactory.lookup(rawBuffer, version)

        if (supplier) {
            const instance = new supplier(rawBuffer)

            return instance.hasValidChecksum ? (instance as T) : undefined
        }

        return undefined
    }
}
