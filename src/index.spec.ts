import * as Exports from './index'


describe('imports', () => {
    it('exports 7 modules', () => {
        expect(Object.keys(Exports)).toHaveLength(7)
    })

    it('contains the requests module', () => {
        expect(Object.keys(Exports.Requests)).toHaveLength(12)
    })
})
