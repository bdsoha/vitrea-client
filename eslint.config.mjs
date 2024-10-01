import alignImport from 'eslint-plugin-align-import'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'


export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        plugins: {
            'align-import': alignImport,
        },
        rules: {
            'align-import/align-import': 2,

            camelcase: 2,

            complexity: [1, {
                max: 4,
            }],

            'comma-spacing': [2, {
                before: false,
                after: true,
            }],

            'key-spacing': [2, {
                align: 'value',
            }],

            'eol-last': [2, 'always'],

            'linebreak-style': [2, 'unix'],

            'no-console': 0,

            'no-duplicate-imports': 2,

            'no-empty': [2, {
                allowEmptyCatch: true,
            }],

            'no-extra-parens': 2,

            'no-trailing-spaces': [2, {
                ignoreComments: true,
            }],

            'no-useless-rename': 2,

            'object-curly-newline': [2, {
                ObjectExpression: {
                    multiline: true,
                },

                ObjectPattern: {
                    multiline: true,
                },

                ImportDeclaration: {
                    multiline: true,
                    minProperties: 4,
                },

                ExportDeclaration: {
                    multiline: true,
                    minProperties: 4,
                },
            }],

            'object-curly-spacing': [2, 'always'],

            quotes: [2, 'single'],

            semi: [2, 'never'],

            'spaced-comment': [2, 'always', {
                exceptions: ['-', '+'],
            }],

            'space-infix-ops': 2,

            '@typescript-eslint/ban-ts-comment': 0,

            "@typescript-eslint/no-extraneous-class": 0
        },
    }
)
