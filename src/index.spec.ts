import * as Exports from './index'


describe('imports', () => {
    it('exports 11 modules', () => {
        expect(Object.keys(Exports)).toHaveLength(11)
    })

    it('contains the requests module', () => {
        expect(Object.keys(Exports.Requests)).toHaveLength(13)
    })
})
