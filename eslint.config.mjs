import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier'; // Import Prettier plugin
import prettierConfig from 'eslint-config-prettier'; // Import Prettier config

export default [
  {
    files: [
      './app/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      './components/**/*.{js,mjs,cjs,ts,jsx,tsx}',
      './tests/**/*.{js,mjs,cjs,ts,jsx,tsx}',
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettierConfig, // Prettier config to disable conflicting ESLint rules
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      prettier: prettier, // Add Prettier as an ESLint plugin
    },
  },
  {
    rules: {
      // "no-console": "warn",  // Warn for console statements
      'react/react-in-jsx-scope': 'off', // Disable React-in-JSX-scope rule for React 17+
      '@typescript-eslint/no-require-imports': 'off', // Allow require() in TypeScript if needed
      'react/no-unescaped-entities': 'off',
      'prettier/prettier': 'error', // Add Prettier as an ESLint rule (will show formatting errors)
    },
  },
];
