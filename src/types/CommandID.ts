export const CommandID = {
    Login: 0x01,
    RoomMetaData: 0x1a,
    RoomCount: 0x1d,
    ToggleNodeStatus: 0x1e,
    NodeMetaData: 0x1f,
    NodeCount: 0x24,
    KeyStatus: 0x29,
    KeyParameters: 0x2b,
    Acknowledgement: 0x00,
    NodeExistenceStatus: 0xc8,
    InternalUnitStatuses: 0x60,
} as const

export type CommandID = (typeof CommandID)[keyof typeof CommandID]
