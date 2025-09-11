export type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Range<T, [R['length'], ...R]>

export type Ratio<T extends number> = number extends T ? number : _Range<T, []>

export type PromiseExecutor<T> = ConstructorParameters<typeof Promise<T>>[0]
