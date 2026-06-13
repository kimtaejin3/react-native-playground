import expoConfig from "eslint-config-expo/flat.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...expoConfig,
  { ignores: ["dist/*", ".expo/*", "node_modules/*"] },
];
