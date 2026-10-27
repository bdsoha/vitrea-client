import type { DataGram } from '../core'
import type { LogLevel, LogMeta, LoggerContract } from '../types'

export class ScopedLogger {
    public constructor(
        protected readonly logger: LoggerContract,
        protected readonly context: LogMeta = {},
    ) {}

    public child(scope: string): ScopedLogger {
        return new ScopedLogger(this.logger, { ...this.context, scope })
    }

    public debug(message: string, meta?: LogMeta) {
        this.write('debug', message, meta)
    }

    public info(message: string, meta?: LogMeta) {
        this.write('info', message, meta)
    }

    public warn(message: string, meta?: LogMeta) {
        this.write('warn', message, meta)
    }

    public error(message: string, meta?: LogMeta) {
        this.write('error', message, meta)
    }

    public traffic(message: string, datagram: DataGram) {
        this.write(datagram.logLevel, message, datagram.logData)
    }

    protected write(level: LogLevel, message: string, meta: LogMeta = {}) {
        this.logger[level](message, {
            ...this.context,
            ...this.normalize(meta),
        })
    }

    protected normalize(meta: LogMeta): LogMeta {
        if (!('error' in meta)) {
            return meta
        }

        const { error } = meta

        return {
            ...meta,
            error: error instanceof Error ? error.message : String(error),
        }
    }
}
