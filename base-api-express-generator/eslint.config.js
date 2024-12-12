// For import export
import globals from 'globals'
import pluginJs from '@eslint/js'

export default [{ languageOptions: { globals: globals.browser } }, pluginJs.configs.recommended]

// // For typescript import export
// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";

// export default [
//   {files: ["**/*.{js,mjs,cjs,ts}"]},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
// ];

// export default [
//     { ignores: ['dist'] },
//     {
//       extends: [js.configs.recommended],
//       files: ['**/*.{js}'],
//       // files: ['**/*.{ts}'],
//       languageOptions: {
//         ecmaVersion: 2020,
//         globals: globals.browser,
//       },
//       rules: {
//       },
//     },
// ]
