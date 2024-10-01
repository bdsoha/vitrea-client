/* eslint-disable */
import { LoggerContract } from './LoggerContract'

export class ConsoleLogger implements LoggerContract<any> {
    public log(message: string, level: string) {
        console.log(message, { level })
    }

    public error(message: string, ...args: any[]) {
        console.error(message, ...args)
    }

    public warn(message: string, ...args: any[]) {
        console.warn(message, ...args)
    }

    public info(message: string, ...args: any[]) {
        console.info(message, ...args)
    }

    public debug(message: string, ...args: any[]) {
        console.debug(message, ...args)
    }
}
