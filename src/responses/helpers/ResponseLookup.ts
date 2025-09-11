import { CommandID }  from '../../types'
import * as Responses from '..'


export const ResponseLookupV1 = {
    [CommandID.Acknowledgement]:      Responses.Acknowledgement,
    [CommandID.InternalUnitStatuses]: Responses.InternalUnitStatuses,
    [CommandID.KeyParameters]:        Responses.KeyParameters,
    [CommandID.KeyStatus]:            Responses.KeyStatus,
    [CommandID.NodeCount]:            Responses.NodeCount,
    [CommandID.NodeMetaData]:         Responses.NodeMetaData,
    [CommandID.RoomCount]:            Responses.RoomCount,
    [CommandID.RoomMetaData]:         Responses.RoomMetaData,
    [CommandID.NodeExistenceStatus]:  Responses.GenericUnusedResponse,
} as const

export const ResponseLookupV2 = {
    ...ResponseLookupV1,
    [CommandID.NodeMetaData]:  Responses.NodeMetaDataV2,
    [CommandID.KeyParameters]: Responses.KeyParametersV2,
} as const
