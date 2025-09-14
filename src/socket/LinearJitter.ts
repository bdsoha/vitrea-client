export class LinearJitter {
    constructor(
        protected readonly base: number,
        protected readonly variance: number,
    ) {}

    public calculate(): number {
        if (this.variance === 0) {
            return this.base
        }

        const flexRange = this.base * this.variance
        const randomFlex = (Math.random() * 2 - 1) * flexRange
        return Math.max(0, this.base + randomFlex)
    }
}
