const IN_PRODUCTION = process.env.NODE_ENV !== 'production'

const OFF  = 0
const WARN = 1
const ERR  = 2

module.exports = {
    root: true,

    ignorePatterns: [
        '/*',
        '!/src'
    ],

    extends: [
        'eslint:recommended', 
        'plugin:@typescript-eslint/recommended'
    ],
    
    parser: '@typescript-eslint/parser',
    
    plugins: [
        '@typescript-eslint',
        'eslint-plugin-align-import'
    ],

    rules: {
        'camelcase':                         ERR,
        'complexity':                        [WARN, {max: 4}],
        'comma-spacing':                     [ERR, { before: false, after: true }],
        'key-spacing':                       [ERR, { align: 'value' }],
        'eol-last':                          [ERR, 'always'],
        'linebreak-style':                   [ERR, 'unix'],
        'no-console':                        IN_PRODUCTION ? OFF : ERR,
        'no-duplicate-imports':              ERR,
        'no-empty':                          [ERR, { allowEmptyCatch: true }],
        'no-extra-parens':                   ERR,
        'no-trailing-spaces':                [ERR, { ignoreComments: true }],
        'no-useless-rename':                 ERR,
        'object-curly-newline':              [ERR, {
            ObjectExpression:  { multiline: true },
            ObjectPattern:     { multiline: true },
            ImportDeclaration: { multiline: true, minProperties: 4 },
            ExportDeclaration: { multiline: true, minProperties: 4 }
        }],
        'object-curly-spacing':              [ERR, 'always'],
        'quotes':                            [ERR, 'single'],
        'semi':                              [ERR, 'never'],
        'spaced-comment':                    [ERR, 'always', { exceptions: ['-', '+'] }],
        'space-infix-ops':                   ERR,

        'align-import/align-import':         ERR,
        '@typescript-eslint/ban-ts-comment': OFF
    }
}