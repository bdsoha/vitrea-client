import {DataGram}          from '../utilities/DataGram'
import {CommandID}         from './ResponseCodes'
import {BaseResponse}      from './BaseResponse'
import {DataGramDirection} from '../utilities/Enums'
import * as Responses      from '.'

export class ResponseFactory {
    protected static readonly lookupTable : Record<CommandID, typeof BaseResponse> = {
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
    }

    protected static isIncoming(rawBuffer : Buffer) : boolean {
        return rawBuffer[DataGram.directionIndex] === DataGramDirection.INCOMING
    }

    protected static lookup(rawBuffer : Buffer) {
        const commandID = rawBuffer[DataGram.commandIDIndex] as CommandID

        return this.lookupTable[commandID]
    }

    static find<T extends BaseResponse>(rawBuffer : Buffer) : T | void {
        if (!this.isIncoming(rawBuffer)) {
            return
        }

        const supplier = this.lookup(rawBuffer)

        if (supplier) {
            // @ts-ignore
            const instance = new supplier(rawBuffer)

            return instance.hasValidChecksum ? instance : undefined
        }
    }
}
