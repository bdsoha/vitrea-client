import type { LogMeta } from './LogMeta'

export interface LoggerContract {
    error(message: string, meta?: LogMeta): void
    warn(message: string, meta?: LogMeta): void
    info(message: string, meta?: LogMeta): void
    debug(message: string, meta?: LogMeta): void
}
