import {AcknowledgeRequest} from './AcknowledgeRequest'


export class Login extends AcknowledgeRequest {
    constructor(username : string, password : string) {
        super(0x01, [
            0x0a,
            ...Buffer.from(username, 'utf16le'), // @TODO: extract
            0x0a,
            ...Buffer.from(password, 'utf16le') // @TODO: extract
        ])
    }
}
