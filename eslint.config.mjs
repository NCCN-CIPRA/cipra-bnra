import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks"
import jsxA11y from 'eslint-plugin-jsx-a11y';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["src/**/*.{ts,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReactHooks.configs['recommended-latest'],
  jsxA11y.flatConfigs.recommended,
  {
    ignores: [
      '**/_deprecated/**',
      '**/build/*',
      '**/public/*',
      'tsconfig.json',
    ],
  },
  {
    rules: {
      // suppress errors for missing 'import React' in files
     "react/react-in-jsx-scope": "off",
    },
  }
];