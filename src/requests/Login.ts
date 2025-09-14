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
}
