import type { BaseResponse } from '../../core'
import { CommandID } from '../../types'
import * as Responses from '..'

type ResponseLookup = Readonly<
    Partial<Record<CommandID, new (raw: Buffer | number[]) => BaseResponse>>
>

export const ResponseLookupV1: ResponseLookup = {
    [CommandID.Login]: Responses.Acknowledgement,
    [CommandID.Acknowledgement]: Responses.Acknowledgement,
    [CommandID.ToggleNodeStatus]: Responses.Acknowledgement,
    [CommandID.InternalUnitStatuses]: Responses.InternalUnitStatuses,
    [CommandID.KeyParameters]: Responses.KeyParameters,
    [CommandID.KeyStatus]: Responses.KeyStatus,
    [CommandID.NodeCount]: Responses.NodeCount,
    [CommandID.NodeMetaData]: Responses.NodeMetaData,
    [CommandID.RoomCount]: Responses.RoomCount,
    [CommandID.RoomMetaData]: Responses.RoomMetaData,
    [CommandID.NodeExistenceStatus]: Responses.GenericUnusedResponse,
}

export const ResponseLookupV2: ResponseLookup = {
    ...ResponseLookupV1,
    [CommandID.NodeMetaData]: Responses.NodeMetaDataV2,
    [CommandID.KeyParameters]: Responses.KeyParametersV2,
}
