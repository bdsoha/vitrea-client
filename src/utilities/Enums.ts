export const KeyPowerStatus = {
    ON:       0x4F,
    OFF:      0x46,
    LONG:     0x4C,
    SHORT:    0x53,
    RELEASED: 0x52,
} as const

export const LEDBackgroundBrightness = {
    OFF:  0,
    LOW:  1,
    HIGH: 2,
    MAX:  3
} as const

export const LockStatus = {
    UNLOCKED: 0,
    LOCKED:   1
} as const

export const DataGramDirection = {
    OUTGOING: 0x3E,
    INCOMING: 0x3C,
} as const

export const KeyCategory = {
    UNDEFINED: 0,
    LIGHT:     1,
    FAN:       6,
    BOILER:    7,
} as const


export type KeyPowerStatus = typeof KeyPowerStatus[keyof typeof KeyPowerStatus]
export type LEDBackgroundBrightness = typeof LEDBackgroundBrightness[keyof typeof LEDBackgroundBrightness]
export type LockStatus = typeof LockStatus[keyof typeof LockStatus]
export type DataGramDirection = typeof DataGramDirection[keyof typeof DataGramDirection]
export type KeyCategory = typeof KeyCategory[keyof typeof KeyCategory]
