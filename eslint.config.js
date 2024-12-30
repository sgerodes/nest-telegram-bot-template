import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';

const compat = new FlatCompat({
  baseDirectory: path.resolve(),
});

export default [
  ...compat.extends([
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ]),
  {
    files: ['**/*.ts'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error'],
    },
    ignores: ['*.sqlite', '*.sqlite3', '*.db', '*.db3', 'node_modules', 'dist', 'coverage'],
  },
];