import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["src/pages/**/*.{ts,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
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
    
  },
];