const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'jsx-a11y'],
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    // 'no-underscore-dangle': 'off',
    // 'import/no-cycle': 'off',
    // 'no-param-reassign': 'warn',
    // "indent": "off",
    // "@typescript-eslint/indent":"warn",
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  // rules: {
  //   'linebreak-style': 'off',
  //   'prettier/prettier': [
  //     'error',
  //     {
  //       endOfLine: 'auto',
  //     },
  //   ],
  //   '@typescript-eslint/no-var-requires': 'off',
  // },
};
