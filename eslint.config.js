import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'build/**', '.history/**'],
  },
  {
    files: ['**/*.js', '**/*.css', '**/*.html'],
  },
  js.configs.recommended,
  prettier,
];
