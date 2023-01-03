// {
//     "rules": {
//         "align-assignments/align-assignments": [
//             2,
//             {
//                 "requiresOnly": false
//             }
//         ]
//     }
// }

const IN_PRODUCTION = process.env.NODE_ENV !== 'production'

const OFF  = 0
const WARN = 1
const ERR  = 2

module.exports = {
    root: true,
    
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    
    parser: '@typescript-eslint/parser',
    
    plugins: ['@typescript-eslint', 'align-assignments'],

    rules: {
        'camelcase':            ERR,
        'complexity':           [WARN, {max: 4}],
        'key-spacing':          [ERR, {align: 'value'}],
        'no-console':           IN_PRODUCTION ? OFF : ERR,
        'no-duplicate-imports': ERR,
        'no-empty':             [ERR, {allowEmptyCatch: true}],
        'no-extra-parens':      ERR,
        'no-trailing-spaces':   [ERR, {'ignoreComments': true}],
        'no-useless-escape':    OFF,
        'no-useless-rename':    ERR,
        'quotes':               [ERR, 'single'],
        'semi':                 [ERR, 'never'],
    }
}