import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'out/**'],
  },
  ...tseslint.configs.recommended,
];
