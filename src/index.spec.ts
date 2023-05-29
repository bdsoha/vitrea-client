import * as Exports from './index'


describe('imports', () => {
    it('exports 3 modules', () => {
        expect(Exports).toHaveLength(3)
    })
    
    it('contains the requests module', () => {
        expect(Exports.Requests).toHaveLength(12)
    })
})
