export enum KeyPowerStatus {
    ON    = 0x4F,
    OFF   = 0x46,
    LONG  = 0x4C,
    SHORT = 0x53
}

export enum LEDBackgroundBrightness {
    OFF  = 0,
    LOW  = 1,
    HIGH = 2,
    MAX  = 3
}

export enum LockStatus {
    UNLOCKED = 0,
    LOCKED   = 1
}

export enum DataGramDirection {
    OUTGOING = 0x3E,
    INCOMING = 0x3C,
}

export enum KeyCategory {
    UNDEFINED = 0,
    LIGHT     = 1,
    FAN       = 6,
    BOILER    = 7,
}
