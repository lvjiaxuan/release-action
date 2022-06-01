module.exports = {
  root: true,
  plugins: ['jest'],
  // [@typescript-eslint](https://typescript-eslint.io/docs/)
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // project: './tsconfig.json',
  },
  rules: {},
  env: {
    node: true,
    es6: true,
    'jest/globals': true
  }
}
