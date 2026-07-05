import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
    {
        ignores: [
            'dist/**',
            'demo/index.umd.js',
            'node_modules/**',
            '.claude/**',
            'coverage/**',
            '*.lock',
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        rules: {
            'no-undef': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        files: ['**/*.mjs'],
        languageOptions: {
            globals: {
                process: 'readonly',
            },
        },
    },
]
