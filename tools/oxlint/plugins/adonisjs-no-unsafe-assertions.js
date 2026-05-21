const noRestrictedTypeAssertionsRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow 'as any', '<any>', 'as unknown', and '<unknown>' type assertions",
    },
    schema: [],
  },
  create(context) {
    return {
      TSAsExpression(node) {
        const assertedType = node.typeAnnotation?.type;

        if (assertedType === "TSAnyKeyword") {
          context.report({
            node,
            message: "Don't use 'as any' type assertions. Use proper typing instead.",
          });
        }

        if (assertedType === "TSUnknownKeyword") {
          context.report({
            node,
            message: "Don't use 'as unknown' type assertions. Use proper typing instead.",
          });
        }
      },
      TSTypeAssertion(node) {
        const assertedType = node.typeAnnotation?.type;

        if (assertedType === "TSAnyKeyword") {
          context.report({
            node,
            message: "Don't use '<any>' type assertions. Use proper typing instead.",
          });
        }

        if (assertedType === "TSUnknownKeyword") {
          context.report({
            node,
            message: "Don't use '<unknown>' type assertions. Use proper typing instead.",
          });
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: "adonisjs-no-unsafe-assertions",
  },
  rules: {
    "no-restricted-type-assertions": noRestrictedTypeAssertionsRule,
  },
};

export default plugin;
