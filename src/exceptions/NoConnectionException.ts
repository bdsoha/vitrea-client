export class NoConnectionException extends Error {
    public constructor(message = 'Socket connection already exists') {
        super(message)
    }
}
