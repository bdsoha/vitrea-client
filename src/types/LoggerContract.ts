import type { LogMeta } from './LogMeta'

export interface LoggerContract<T = LogMeta, R = void> {
    log(message: string, level: string): R
    error(message: string, ...args: T[]): R
    warn(message: string, ...args: T[]): R
    info(message: string, ...args: T[]): R
    debug(message: string, ...args: T[]): R
}
