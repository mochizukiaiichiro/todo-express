module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  settings: {
    next: {
      rootDir: ['app/', 'pages/'],
    },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Prettierと連動
    'next/core-web-vitals', // Next.js推奨
  ],
  rules: {
    'prettier/prettier': 'error', // Prettier違反をESLintエラー扱い
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
