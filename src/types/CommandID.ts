export const CommandID = {
    Login:                0x01,
    RoomMetaData:         0x1A,
    RoomCount:            0x1D,
    NodeMetaData:         0x1F,
    NodeCount:            0x24,
    KeyStatus:            0x29,
    KeyParameters:        0x2B,
    Acknowledgement:      0x00,
    NodeExistenceStatus:  0xC8,
    InternalUnitStatuses: 0x60,
} as const

export type CommandID = typeof CommandID[keyof typeof CommandID]
