import * as Exports from './index'


describe('imports', () => {
    it('exports 6 modules', () => {
        expect(Object.keys(Exports)).toHaveLength(6)
    })

    it('contains the requests module', () => {
        expect(Object.keys(Exports.Requests)).toHaveLength(12)
    })
})
