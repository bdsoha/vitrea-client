import * as Exports from './index'


describe('imports', () => {
    it('exports 3 modules', () => {
        expect(Object.keys(Exports)).toHaveLength(3)
    })
    
    it('contains the requests module', () => {
        expect(Object.keys(Exports.Requests)).toHaveLength(12)
    })
})
