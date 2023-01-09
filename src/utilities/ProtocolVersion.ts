export const ProtocolVersion = {
    V1: 'v1',
    V2: 'v2'
} as const


export type ProtocolVersion = typeof ProtocolVersion[keyof typeof ProtocolVersion]
