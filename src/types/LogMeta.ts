export type LogMeta =
    | string
    | number
    | boolean
    | null
    | undefined
    | LogMeta[]
    | { [key: string]: LogMeta }
    | { [key: number]: LogMeta }
