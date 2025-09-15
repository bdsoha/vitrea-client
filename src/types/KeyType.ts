export const KeyType = {
    NOT_EXIST: 0,
    NOT_ACTIVE: 1,
    TOGGLE: 2,
    BLIND: 3,
    PUSH_BUTTON: 4,
    DIMMER: 5,
    DIMMER_MW: 10,
    BLIND_MW: 11,
    SATELLITE: 12,
    TOGGLE_SCENE: 13,
    DUAL_POLE: 14,
    BOILER: 15,
    REPEATER: 16,
    THERMOSTAT: 17,
    ALL_NODES: 101,
} as const

export type KeyType = (typeof KeyType)[keyof typeof KeyType]
