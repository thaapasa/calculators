import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ["src/**/*.ts", "src/**/*.tsx"],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
  ],
  plugins: {
    "react-hooks": reactHooks,
    "simple-import-sort": simpleImportSort,
    "unused-imports": unusedImports,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'no-console': 'warn',
    'unused-imports/no-unused-imports': 'error',
    'simple-import-sort/imports': ['warn'],
    'simple-import-sort/exports': ['warn'],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true
      }
    ]
  }
})
