import globals from "globals";
import json from "eslint-plugin-json";
import mozilla from "eslint-plugin-mozilla";

export default [
  {
    ignores: [
      "node_modules/",
      "web-ext-artifacts/",
      "extension/libs/",
      "extension/content/libs/",
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.es2024,
      },
    },
  },
  ...mozilla.configs["flat/recommended"],
  {
    files: ["**/*.json"],
    plugins: { json },
    processor: json.processors[".json"],
    rules: json.configs.recommended.rules,
  },
  {
    files: ["extension/**"],
    languageOptions: {
      globals: {
        ...globals.webextensions,
      },
    },
  },
  {
    files: ["extension/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["extension/content/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["extension/experiments/**"],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...mozilla.environments.privileged.globals,
      },
    },
  },
  {
    files: [
      ".prettierrc.js",
    ],
    languageOptions: {
      sourceType: "script",
      globals: {
        ...globals.node,
      },
    },
  },
];
