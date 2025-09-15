export const LockStatus = {
    UNLOCKED: 0,
    LOCKED: 1,
} as const

export type LockStatus = (typeof LockStatus)[keyof typeof LockStatus]
