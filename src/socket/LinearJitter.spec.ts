import { LinearJitter } from './LinearJitter'

describe('LinearJitter', () => {
    it('[calculate] returns base value when variance is zero', () => {
        const jitter = new LinearJitter(250, 0)

        expect(jitter.calculate()).toBe(250)
    })

    it('[calculate] returns base value when base is zero', () => {
        const jitter = new LinearJitter(0, 0.5)

        expect(jitter.calculate()).toBe(0)
    })
})
