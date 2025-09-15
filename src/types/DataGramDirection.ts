export const DataGramDirection = {
    OUTGOING: 0x3e,
    INCOMING: 0x3c,
} as const

export type DataGramDirection =
    (typeof DataGramDirection)[keyof typeof DataGramDirection]
