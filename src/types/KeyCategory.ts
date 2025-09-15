export const KeyCategory = {
    UNDEFINED: 0,
    LIGHT: 1,
    FAN: 6,
    BOILER: 7,
    AUDIO: 8,
    SCENARIO: 11,
} as const

export type KeyCategory = (typeof KeyCategory)[keyof typeof KeyCategory]
