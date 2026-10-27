export const CommandID = {
    Acknowledgement: 0x00,
    Login: 0x01,
    Heartbeat: 0x07,
    ToggleHeartbeat: 0x08,
    RoomMetaData: 0x1a,
    RoomCount: 0x1d,
    ToggleNodeStatus: 0x1e,
    NodeMetaData: 0x1f,
    NodeStatus: 0x23,
    NodeCount: 0x24,
    ToggleKeyStatus: 0x28,
    KeyStatus: 0x29,
    KeyParameters: 0x2b,
    InternalUnitStatuses: 0x60,
    NodeExistenceStatus: 0xc8,
} as const

export type CommandID = (typeof CommandID)[keyof typeof CommandID]
