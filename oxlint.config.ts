import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["unicorn", "typescript", "oxc", "react", "import"],
  jsPlugins: [
    {
      name: "adonisjs-no-unsafe-assertions",
      specifier: "./tools/oxlint/plugins/adonisjs-no-unsafe-assertions.js",
    },
    {
      name: "adonisjs-conventions",
      specifier: "./tools/oxlint/plugins/adonisjs-conventions.js",
    },
  ],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  rules: {
    "no-console": "off",
    "no-debugger": "error",
    "import/no-unassigned-import": "off",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrors: "none",
      },
    ],
    "react/react-in-jsx-scope": "off",
    "adonisjs-no-unsafe-assertions/no-restricted-type-assertions": "error",
    "adonisjs-conventions/require-expected-error-boundary": "warn",
    "adonisjs-conventions/no-controller-model-mutations": "error",
    "adonisjs-conventions/no-controller-model-queries": "warn",
    "adonisjs-conventions/no-controller-private-methods": "error",
    "adonisjs-conventions/no-controller-top-level-functions": "error",
    "adonisjs-conventions/no-controller-raw-request-input": "error",
    "adonisjs-conventions/no-controller-to-controller-delegation": "error",
    "adonisjs-conventions/no-unsafe-inertia-prop-casts": "error",
    "adonisjs-conventions/require-action-execute-method": "error",
    "adonisjs-conventions/no-service-domain-action-dependency": "error",
    "adonisjs-conventions/require-structured-error-logging": "error",
    eqeqeq: ["error", "always"],
    "no-eval": "error",
    "no-caller": "error",
    "no-new-wrappers": "error",
    "no-cond-assign": ["error", "except-parens"],
    curly: ["error", "all"],
    "handle-callback-err": ["error", "^(err|error)$"],
  },
  env: {
    builtin: true,
    es2024: true,
    node: true,
  },
  settings: {
    react: {
      linkComponents: [
        {
          name: "Link",
          attribute: "href",
        },
      ],
    },
    "jsx-a11y": {
      components: {
        Link: "a",
        Button: "button",
      },
    },
  },
  ignorePatterns: [
    "node_modules/**",
    "dist/**",
    "build/**",
    ".adonisjs/**",
    "database/schema.ts",
    "*.d.ts",
    "bin/**",
    "extensions/**/dist/**",
    "starter-kits/**",
  ],
  overrides: [
    {
      files: ["inertia/**/*.ts", "inertia/**/*.tsx", "config/**/*.ts", "ace.js", "adonisrc.ts"],
      rules: {
        "typescript/triple-slash-reference": "off",
      },
    },
    {
      files: ["app/**/*.ts", "database/seeders/**/*.ts", "tests/**/*.ts", "commands/**/*.ts"],
      rules: {
        "no-await-in-loop": "off",
      },
    },
    {
      files: ["test/**/*.ts", "test/**/*.tsx", "tests/**/*.ts", "tests/**/*.tsx"],
      rules: {
        "adonisjs-no-unsafe-assertions/no-restricted-type-assertions": "off",
      },
    },
  ],
});
