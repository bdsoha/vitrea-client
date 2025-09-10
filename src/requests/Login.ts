import { AcknowledgeRequest } from './AcknowledgeRequest'


export class Login extends AcknowledgeRequest {
    constructor(username : string, password : string) {
        super(0x01, [
            Buffer.from(username, 'utf16le').length,
            ...Buffer.from(username, 'utf16le'),
            Buffer.from(password, 'utf16le').length,
            ...Buffer.from(password, 'utf16le')
        ])
    }
}
