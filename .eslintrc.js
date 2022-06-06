module.exports = {
  root: true,
  // [@typescript-eslint](https://typescript-eslint.io/docs/)
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // project: './tsconfig.json',
  },
  env: {
    node: true,
    es6: true,
  }
}
