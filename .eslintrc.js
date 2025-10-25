module.exports = {
  root: true,
  extends: ['plugin:react/recommended', ''],
  plugins: ['react'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  rules: {
    // 🔒 Prevents the “Text strings must be rendered within a <Text>” runtime error
    'react-native/no-raw-text': 'error',

    // sensible RN defaults for Expo/TS
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};
