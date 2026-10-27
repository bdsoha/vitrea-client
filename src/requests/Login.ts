import { DataGram } from '../core'
import type { LogMeta } from '../types'
import { CommandID } from '../types'
import { AcknowledgeRequest } from './AcknowledgeRequest'

export class Login extends AcknowledgeRequest {
    constructor(username: string, password: string) {
        super(CommandID.Login, [
            Buffer.from(username, 'utf16le').length,
            ...Buffer.from(username, 'utf16le'),
            Buffer.from(password, 'utf16le').length,
            ...Buffer.from(password, 'utf16le'),
        ])
    }

    public override get logData(): LogMeta {
        const header = this.frame.slice(0, DataGram.dataIndex)

        return {
            ...super.logData,
            data: '[redacted]',
            raw: `${this.toHexString(header)}:[redacted]`,
        }
    }
}
