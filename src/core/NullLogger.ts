/* eslint-disable */
import { LoggerContract } from "./LoggerContract";


export class NullLogger implements LoggerContract<any> {
    public log(_message: string, _level: string) { }
    
    public error(_message: string, ..._args: any[]) {}
    
    public warn(_message: string, ..._args: any[]) {}
    
    public info(_message: string, ..._args: any[]) {}
    
    public http(_message: string, ..._args: any[]) {}
    
    public verbose(_message: string, ..._args: any[]) {}
    
    public debug(_message: string, ..._args: any[]) {}
    
    public silly(_message: string, ..._args: any[]) {}
}