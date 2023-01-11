export class ConnectionExistsException extends Error {
    public constructor(message = 'No socket connection established') {
        super(message)
    }
}
