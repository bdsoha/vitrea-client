import type { LogMeta, LoggerContract } from '../types'

export class ConsoleLogger implements LoggerContract {
    public error(message: string, meta: LogMeta = {}) {
        console.error(message, meta)
    }

    public warn(message: string, meta: LogMeta = {}) {
        console.warn(message, meta)
    }

    public info(message: string, meta: LogMeta = {}) {
        console.info(message, meta)
    }

    public debug(message: string, meta: LogMeta = {}) {
        console.debug(message, meta)
    }
}
