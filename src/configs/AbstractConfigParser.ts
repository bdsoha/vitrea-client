export abstract class AbstractConfigParser<R> {
    protected constructor(protected readonly configs: Partial<R>) {}

    protected validate<T extends keyof R>(
        lookup: string,
        found: string | R[T],
    ) {
        if (!found && found !== false) {
            throw TypeError(`A value for [${lookup}] is required`)
        }

        return found
    }

    protected get<T extends keyof R>(key: T, fallback: R[T] = undefined) {
        const lookup: string = key as string

        const envLookup = lookup
            .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
            .toUpperCase()

        const found =
            this.configs[key]
            ?? process.env[`VITREA_VBOX_${envLookup}`]
            ?? fallback

        return this.validate(lookup, found)
    }
}
