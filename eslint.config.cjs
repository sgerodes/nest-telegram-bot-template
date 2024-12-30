const path = require('path');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['*.sqlite', '*.sqlite3', '*.db', '*.db3', 'node_modules', 'dist', 'coverage'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        tsconfigRootDir: path.resolve(),
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error'],
      'prettier/prettier': ['error'],
    },
  },
];