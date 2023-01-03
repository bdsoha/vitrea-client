export interface WritableSocketContract {
    write(data : Buffer) : Promise<void>
}