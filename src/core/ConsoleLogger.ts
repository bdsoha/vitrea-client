import type { LogMeta, LoggerContract } from '../types'

export class ConsoleLogger implements LoggerContract<LogMeta> {
    public log(message: string, level: string) {
        console.log(message, { level })
    }

    public error(message: string, ...args: LogMeta[]) {
        console.error(message, ...args)
    }

    public warn(message: string, ...args: LogMeta[]) {
        console.warn(message, ...args)
    }

    public info(message: string, ...args: LogMeta[]) {
        console.info(message, ...args)
    }

    public debug(message: string, ...args: LogMeta[]) {
        console.debug(message, ...args)
    }
}
