import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.ts'],
    ignores: ['dist/'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
  },
  {
    files: ['dev/**/*.ts'],
    ignores: ['dist/'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.dev.json',
        sourceType: 'module',
      },
    },
  },
  {
    rules: {
      ...prettier.rules,
    },
  },
];
