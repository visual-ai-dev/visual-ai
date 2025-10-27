import tseslint from "typescript-eslint";
import perfectionist from "eslint-plugin-perfectionist";

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "eslint.config.mjs",
      "bundled_*.mjs",
      "*.mjs",
      "*.cjs",
      "*.js",
      "*.json",
      "*.md",
      "kitchen-sink/**",
    ],
  },
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  perfectionist.configs["recommended-natural"],
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "import/order": "off",
    },
  },
);
