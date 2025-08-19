// eslint.config.js
import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';

// Next.js Core Web Vitals を Flat Config に移植
const coreWebVitalsConfig = nextPlugin.configs['core-web-vitals'];

export default [
  // 無視パターン
  {
    ignores: ['node_modules', 'dist', '.next'],
  },

  // JavaScript推奨ルール
  js.configs.recommended,

  // TypeScript推奨ルール
  {
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },

  // Next.js Core Web Vitals
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...coreWebVitalsConfig.rules,
      '@next/next/no-html-link-for-pages': 'off',
    },
    settings: {
      next: {
        rootDir: ['src/'],
      },
    },
  },

  // Prettier連動
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // Prettier違反をエラー扱い
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], 
    },
  },

  // Node.js 環境、ブラウザ用、Jest 環境用グローバルを有効化
  {
    files: [
      '**/*.js',
      '**/*.cjs',
      'src/**/*.ts',
      'src/**/*.tsx',
      '**/__tests__/**/*.ts',
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser, // fetch, window など
        ...globals.jest, // describe, test など
        React: 'readonly', // React をグローバルとして登録
      },
    },
  },
];
