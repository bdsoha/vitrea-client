// biome-ignore lint/complexity/noStaticOnlyClass: Static utility class pattern is intentional
export class SplitMultipleBuffers {
    public static handle(buffer: Buffer): Buffer[] {
        return buffer
            .toString('hex')
            .replace(/5654553c/g, ';;;5654553c')
            .split(';;;')
            .filter(Boolean)
            .map(string => Buffer.from(string, 'hex'))
    }
}
