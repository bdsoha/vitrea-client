import * as Exports from './index'

describe('imports', () => {
    it('exports 13 modules', () => {
        expect(Object.keys(Exports)).toHaveLength(13)
    })

    it('contains the requests module', () => {
        expect(Object.keys(Exports.Requests)).toHaveLength(13)
    })
})
