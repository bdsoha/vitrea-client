export const KeyPowerStatus = {
    ON: 0x4f,
    OFF: 0x46,
    LONG: 0x4c,
    SHORT: 0x53,
    RELEASED: 0x52,
} as const

export type KeyPowerStatus =
    (typeof KeyPowerStatus)[keyof typeof KeyPowerStatus]
