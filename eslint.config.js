import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'build', '*.config.js', '*.config.ts'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react: react,
      import: importPlugin,
    },
    rules: {
      // React Hooks - Prevent infinite loops and stale closures
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'error',

      // React Performance & Best Practices
      'react/jsx-no-leaked-render': [
        'error',
        { validStrategies: ['coerce', 'ternary'] },
      ],
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          warnOnDuplicates: true,
        },
      ],
      'react/no-array-index-key': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: false }],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always',
        },
      ],
      'react/hook-use-state': 'error', // Enforce symmetric naming
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-constructed-context-values': 'error', // Performance
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: true,
          allowBind: false,
          ignoreRefs: true,
        },
      ],

      // TypeScript - Type Safety & Code Quality
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: true, // Allow idiomatic string checks
          allowNumber: false, // Still strict on numbers
          allowNullableObject: false,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowAny: false,
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Import Organization - Strict alphabetical ordering
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // External packages
            'internal', // Internal aliases
            'parent', // Parent imports
            'sibling', // Sibling imports
            'index', // Index imports
            'type', // Type imports
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-dom',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-router-dom',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '~/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-dom'],
          distinctGroup: false,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
            orderImportKind: 'asc',
          },
        },
      ],
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',

      // Clean Code Patterns
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'arrow-body-style': ['error', 'as-needed'],

      // Prevent Common React Mistakes
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.object.name="React"][callee.property.name="useEffect"] > ArrowFunctionExpression > BlockStatement > :not(ReturnStatement)',
          message:
            'useEffect must have proper cleanup. Consider if you need a return statement.',
        },
        {
          selector:
            'CallExpression[callee.property.name="setState"] > ArrowFunctionExpression > CallExpression[callee.property.name="setState"]',
          message:
            'Do not call setState in setState updater. Use functional updates.',
        },
      ],

      // Path restrictions for clean architecture
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../../*', '../../../../*'],
              message:
                'Use absolute imports with @ or ~ alias instead of deep relative imports',
            },
          ],
        },
      ],

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
);
