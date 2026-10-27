export class ConnectionExistsException extends Error {
    public constructor(message = 'Socket connection already exists') {
        super(message)
        this.name = 'ConnectionExistsException'
    }
}
