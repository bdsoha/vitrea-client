export class NoConnectionException extends Error {
    public constructor(message = 'No socket connection established') {
        super(message)
        this.name = 'NoConnectionException'
    }
}
