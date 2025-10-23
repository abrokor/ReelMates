// eslint.config.cjs  — ESLint v9 “flat” config for React-Native + TS
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const rnPlugin = require('eslint-plugin-react-native');
const globals = require('globals');

module.exports = [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.expo/**',
      '.expo-shared/**',
      'android/**',
      'ios/**',
    ],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // Browser + ES globals
        ...globals.browser,
        ...globals.es2021,

        // React Native / Metro globals
        __DEV__: 'readonly',

        // RN runtime globals that “no-undef” was complaining about
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-native': rnPlugin,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Turn off “false positives” for RN
      'no-undef': 'off',
      'react/react-in-jsx-scope': 'off',

      // Console is useful during development
      'no-console': 'off',

      // Make unused vars a *warning* and allow leading underscore to silence
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],

      // A couple of sensible defaults
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-key': 'warn',
      'react-native/no-inline-styles': 'off', // we intentionally use RN inline styles
    },
  },
];
