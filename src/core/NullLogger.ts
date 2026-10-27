import type { LoggerContract } from '../types'

export class NullLogger implements LoggerContract {
    public error() {}

    public warn() {}

    public info() {}

    public debug() {}
}
