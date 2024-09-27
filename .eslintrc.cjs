/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'import',
    'prettier',
    'simple-import-sort',
    'unused-imports',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-empty-pattern': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    // See https://github.com/prettier/eslint-plugin-prettier#arrow-body-style-and-prefer-arrow-callback-issue
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'import/no-duplicates': 'error',
    'react/prop-types': 'off',
    'unused-imports/no-unused-imports': 'error',
    'simple-import-sort/imports': ['warn'],
    'simple-import-sort/exports': ['warn'],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src/shared', 'src/server', 'src/client'],
      },
    },
  },
};
