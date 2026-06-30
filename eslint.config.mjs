import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // No accidental console.log in production
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // TypeScript: avoid explicit any
      '@typescript-eslint/no-explicit-any': 'warn',

      // React 19: JSX transform — no import needed
      'react/react-in-jsx-scope': 'off',

      // Always use next/image instead of <img>
      '@next/next/no-img-element': 'error',
    },
  },
  {
    // Tests may use console freely
    files: ['tests/**/*.ts', '**/*.spec.ts', '**/*.test.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]

export default eslintConfig
