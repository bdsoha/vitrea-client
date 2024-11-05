import { CommandID }              from '../ResponseCodes'
import { ProtocolVersion }        from '../../configs'
import { DataGramDirection }      from '../../utilities/Enums'
import { BaseResponse, DataGram } from '../../core'
import * as Responses             from '..'

const lookup: Record<CommandID, typeof BaseResponse> = {
    [CommandID.Acknowledgement]:      Responses.Acknowledgement,
    [CommandID.InternalUnitStatuses]: Responses.InternalUnitStatuses,
    [CommandID.KeyParameters]:        Responses.KeyParameters,
    [CommandID.KeyStatus]:            Responses.KeyStatus,
    [CommandID.NodeCount]:            Responses.NodeCount,
    [CommandID.NodeMetaData]:         Responses.NodeMetaData,
    [CommandID.RoomCount]:            Responses.RoomCount,
    [CommandID.RoomMetaData]:         Responses.RoomMetaData,

    // Ignored Response
    [CommandID.NodeExistenceStatus]: Responses.GenericUnusedResponse,
} as const

const lookupV2: Record<CommandID, typeof BaseResponse> = {
    ...lookup,
    [CommandID.NodeMetaData]:  Responses.NodeMetaDataV2,
    [CommandID.KeyParameters]: Responses.KeyParametersV2,
} as const

export class ResponseFactory {
    protected static readonly lookupTable = {
        [ProtocolVersion.V1]: lookup,
        [ProtocolVersion.V2]: lookupV2,
    }

    protected static isIncoming(rawBuffer: Buffer): boolean {
        return rawBuffer[DataGram.directionIndex] === DataGramDirection.INCOMING
    }

    protected static lookup(rawBuffer: Buffer, version: ProtocolVersion) {
        const commandID = rawBuffer[DataGram.commandIDIndex] as CommandID

        return this.lookupTable[version][commandID]
    }

    static find<T extends BaseResponse>(rawBuffer: Buffer, version: ProtocolVersion): T | void {
        if (!this.isIncoming(rawBuffer)) {
            return
        }

        const supplier = this.lookup(rawBuffer, version)

        if (supplier) {
            // @ts-ignore
            const instance = new supplier(rawBuffer)

            return instance.hasValidChecksum ? instance : undefined
        }
    }
}
