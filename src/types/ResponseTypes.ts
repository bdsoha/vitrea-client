import { CommandID }                          from './CommandID'
import { ProtocolVersion }                    from './ProtocolVersion'
import { ResponseLookupV1, ResponseLookupV2 } from '../responses/helpers/ResponseLookup'


export type ResponseLookupV1Type = typeof ResponseLookupV1
export type ResponseLookupV2Type = typeof ResponseLookupV2

export type ResponseForCommandAndVersion<
  C extends CommandID,
  V extends ProtocolVersion
> = V extends typeof ProtocolVersion.V1
  ? InstanceType<ResponseLookupV1Type[C]>
  : InstanceType<ResponseLookupV2Type[C]>

export type ExtractCommandID<T> = T extends { commandID: infer C extends CommandID } ? C : never

export type RequestToResponse<T, V extends ProtocolVersion> =
  ExtractCommandID<T> extends CommandID
    ? ResponseForCommandAndVersion<ExtractCommandID<T>, V>
    : never
