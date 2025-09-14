import type { LogMeta, LoggerContract } from '../types'

export class NullLogger implements LoggerContract<LogMeta> {
    public log(_message: string, _level: string) {}

    public error(_message: string, ..._args: LogMeta[]) {}

    public warn(_message: string, ..._args: LogMeta[]) {}

    public info(_message: string, ..._args: LogMeta[]) {}

    public debug(_message: string, ..._args: LogMeta[]) {}
}
