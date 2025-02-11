import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';

export default tseslint.config(
  { ignores: ['dist', 'public'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    extends: [
      pluginJs.configs.recommended,
      ...tseslint.configs.recommended,
      eslintPluginPrettierRecommended,
    ],
    plugins: {
      prettier,
      react,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {},
  },
);
