import { BaseResponse } from '../core'
import type { LogLevel } from '../types'

export class GenericUnusedResponse extends BaseResponse {
    static override readonly logLevel: LogLevel = 'debug'
}
