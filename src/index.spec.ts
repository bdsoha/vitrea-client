import * as Exports from './index'


describe('imports', () => {
    it('exports 3 modules', () => {
        expect(Exports.keys()).toHaveLength(3)
    })
    
    it('contains the requests module', () => {
        expect(Exports.Requests.keys()).toHaveLength(12)
    })
})
