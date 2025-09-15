export const LEDBackgroundBrightness = {
    OFF: 0,
    LOW: 1,
    NORMAL: 2,
    HIGH: 3,
    MAX: 4,
} as const

export type LEDBackgroundBrightness =
    (typeof LEDBackgroundBrightness)[keyof typeof LEDBackgroundBrightness]
