import js                from '@eslint/js'
import path              from 'node:path'
import tsParser          from '@typescript-eslint/parser'
import alignImport       from 'eslint-plugin-align-import'
import { FlatCompat }    from '@eslint/eslintrc'
import typescriptEslint  from '@typescript-eslint/eslint-plugin'
import { fileURLToPath } from 'node:url'

const compat = new FlatCompat({
    baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

export default [{
    ignores: ['*', '!src'],
}, ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'), {
    plugins: {
        '@typescript-eslint': typescriptEslint,
        'align-import': alignImport,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
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
        'align-import/align-import': 2,
        '@typescript-eslint/ban-ts-comment': 0,
    },
}]
