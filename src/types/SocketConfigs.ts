import type * as Net from 'node:net'
import type { LoggerContract } from './LoggerContract'

export interface SocketConfigs {
    heartbeatInterval: number
    ignoreAckLogs: boolean
    log: LoggerContract
    maxRetries: number
    requestBuffer: number
    requestBufferVariance: number
    requestTimeout: number
    shouldReconnect: boolean
    socketSupplier(): Net.Socket
}
