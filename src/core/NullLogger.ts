/* eslint-disable */
import { LoggerContract } from '../types'


export class NullLogger implements LoggerContract<any> {
    public log(_message: string, _level: string) { }

    public error(_message: string, ..._args: any[]) { }

    public warn(_message: string, ..._args: any[]) { }

    public info(_message: string, ..._args: any[]) { }

    public debug(_message: string, ..._args: any[]) { }
}
