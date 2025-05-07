// eslint.config.ts
import js from '@eslint/js';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default tseslint.config(
  {
    ignores: ['dist'], // Ignored paths
  },

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    // Base ESLint + TypeScript recommended
    extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],

    rules: {
      // TypeScript relaxed rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-expect-error': false,
          'ts-ignore': true,
        },
      ],

      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Vite/React refresh rules
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Logging rules
      'no-console': ['warn', { allow: ['warn', 'error', 'debug', 'info'] }],
      'no-prototype-builtins': 'off',

      // React JSX for React 17+
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
);
