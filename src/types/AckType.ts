export const AckType = {
    ACK: 0,
    NACK: 1,
    ERROR: 2,
    IN_USE: 3,
    NOT_AVAILABLE: 4,
} as const

export type AckType = (typeof AckType)[keyof typeof AckType]
