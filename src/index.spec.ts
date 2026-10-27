import * as Exports from './index'

describe('imports', () => {
    it('exports 14 modules', () => {
        expect(Object.keys(Exports)).toHaveLength(14)
    })

    it('contains the requests module', () => {
        expect(Object.keys(Exports.Requests)).toHaveLength(13)
    })
})
