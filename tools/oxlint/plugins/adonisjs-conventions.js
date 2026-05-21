const EXPECTED_ERROR_BOUNDARY = "@expected-error-boundary";
const RAW_PROVIDER_ENVELOPE = "@raw-provider-envelope";
const ACTION_INTERFACE_EXCEPTION = "@action-interface";

function filenameIncludes(context, segment) {
  return (context.filename ?? context.getFilename?.() ?? "").includes(segment);
}

function nodeName(node) {
  if (!node) {
    return null;
  }
  if (node.type === "Identifier") {
    return node.name;
  }
  if (node.type === "PrivateIdentifier") {
    return node.name;
  }
  if (node.type === "Literal") {
    return String(node.value);
  }
  return null;
}

function memberPropertyName(memberExpression) {
  return nodeName(memberExpression?.property);
}

function memberObjectName(memberExpression) {
  const object = memberExpression?.object;
  if (!object) {
    return null;
  }
  if (object.type === "Identifier") {
    return object.name;
  }
  if (object.type === "MemberExpression") {
    const parent = memberObjectName(object);
    const property = memberPropertyName(object);
    return parent && property ? `${parent}.${property}` : (property ?? parent);
  }
  return null;
}

function containsThrow(statement, seen = new WeakSet()) {
  if (!statement || typeof statement !== "object") {
    return false;
  }

  if (seen.has(statement)) {
    return false;
  }
  seen.add(statement);

  if (statement.type === "ThrowStatement") {
    return true;
  }

  for (const key of Object.keys(statement)) {
    if (["parent", "range", "loc", "start", "end"].includes(key)) {
      continue;
    }

    const value = statement[key];
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.some((item) => containsThrow(item, seen))) {
        return true;
      }
      continue;
    }

    if (typeof value === "object" && containsThrow(value, seen)) {
      return true;
    }
  }

  return false;
}

function commentsFor(context, node) {
  const sourceCode = context.sourceCode ?? context.getSourceCode?.();
  if (!sourceCode) {
    return [];
  }

  const before = sourceCode.getCommentsBefore?.(node) ?? [];
  const inside = sourceCode.getCommentsInside?.(node.body ?? node) ?? [];
  return [...before, ...inside];
}

function hasMarker(context, node, marker) {
  if (
    commentsFor(context, node).some(
      (comment) => typeof comment?.value === "string" && comment.value.includes(marker),
    )
  ) {
    return true;
  }

  const sourceCode = context.sourceCode ?? context.getSourceCode?.();
  const text = sourceCode?.text;
  const startLine = node.loc?.start?.line;
  if (!text || !startLine) {
    return false;
  }

  const lines = text.split(/\r?\n/);
  const nearbyLeadingText = lines.slice(Math.max(0, startLine - 4), startLine - 1).join("\n");
  return nearbyLeadingText.includes(marker);
}

function isLoggerCall(node) {
  if (node?.type !== "CallExpression" || node.callee?.type !== "MemberExpression") {
    return false;
  }

  const objectName = memberObjectName(node.callee);
  const propertyName = memberPropertyName(node.callee);
  return objectName === "logger" && ["error", "warn", "info", "debug"].includes(propertyName);
}

function objectHasErrProperty(objectExpression, errorName) {
  return objectExpression?.properties?.some((property) => {
    if (!property || property.type === "SpreadElement") {
      return false;
    }

    const keyName = nodeName(property.key);
    if (keyName !== "err") {
      return false;
    }

    if (!errorName) {
      return true;
    }

    return property.value?.type === "Identifier" && property.value.name === errorName;
  });
}

function containsLoggerCallWithoutStructuredError(statement, errorName, seen = new WeakSet()) {
  if (!statement || typeof statement !== "object") {
    return false;
  }

  if (seen.has(statement)) {
    return false;
  }
  seen.add(statement);

  if (isLoggerCall(statement)) {
    const firstArgument = statement.arguments?.[0];
    return (
      firstArgument?.type !== "ObjectExpression" || !objectHasErrProperty(firstArgument, errorName)
    );
  }

  for (const key of Object.keys(statement)) {
    if (["parent", "range", "loc", "start", "end"].includes(key)) {
      continue;
    }

    const value = statement[key];
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      if (value.some((item) => containsLoggerCallWithoutStructuredError(item, errorName, seen))) {
        return true;
      }
      continue;
    }

    if (
      typeof value === "object" &&
      containsLoggerCallWithoutStructuredError(value, errorName, seen)
    ) {
      return true;
    }
  }

  return false;
}

const requireExpectedErrorBoundaryRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require @expected-error-boundary marker on catch blocks that do not rethrow errors",
    },
    schema: [],
    messages: {
      missingBoundary:
        "Catch blocks that do not rethrow must include @expected-error-boundary with the reason/fallback/reporting intent.",
    },
  },
  create(context) {
    return {
      CatchClause(node) {
        if (containsThrow(node.body) || hasMarker(context, node, EXPECTED_ERROR_BOUNDARY)) {
          return;
        }

        context.report({ node, messageId: "missingBoundary" });
      },
    };
  },
};

const noControllerModelMutationsRule = {
  meta: {
    type: "problem",
    docs: { description: "Disallow direct model/database mutations inside controllers" },
    schema: [],
    messages: {
      noMutation:
        "Controllers must delegate mutations/workflows to actions instead of calling {{call}} directly.",
    },
  },
  create(context) {
    if (!filenameIncludes(context, "/app/controllers/")) {
      return {};
    }

    return {
      CallExpression(node) {
        if (node.callee?.type !== "MemberExpression") {
          return;
        }

        const propertyName = memberPropertyName(node.callee);
        const objectName = memberObjectName(node.callee);
        const object = node.callee.object;
        const isDbMutation =
          objectName === "db" &&
          ["insert", "update", "delete", "del", "table"].includes(propertyName);
        const isModelCreate =
          propertyName === "create" && object?.type === "Identifier" && /^[A-Z]/.test(object.name);
        const isModelMutation = ["save", "delete", "merge", "updateOrCreate"].includes(
          propertyName,
        );

        if (!isDbMutation && !isModelCreate && !isModelMutation) {
          return;
        }

        context.report({
          node,
          messageId: "noMutation",
          data: { call: objectName === "db" ? `db.${propertyName}` : propertyName },
        });
      },
    };
  },
};

const noControllerModelQueriesRule = {
  meta: {
    type: "suggestion",
    docs: { description: "Warn on direct model/database read queries inside controllers" },
    schema: [],
    messages: {
      noQuery:
        "Controller query access should stay simple. Move complex reads/page data to actions; calling {{call}} directly is an architecture attention point.",
    },
  },
  create(context) {
    if (!filenameIncludes(context, "/app/controllers/")) {
      return {};
    }

    return {
      CallExpression(node) {
        if (node.callee?.type !== "MemberExpression") {
          return;
        }

        const propertyName = memberPropertyName(node.callee);
        const objectName = memberObjectName(node.callee);
        const object = node.callee.object;
        const isDbRead = objectName === "db" && ["from", "raw"].includes(propertyName);
        const isModelQuery = propertyName === "query";
        const isModelFind =
          ["find", "findOrFail", "first", "firstOrFail"].includes(propertyName) &&
          object?.type === "Identifier" &&
          /^[A-Z]/.test(object.name);

        if (!isDbRead && !isModelQuery && !isModelFind) {
          return;
        }

        context.report({
          node,
          messageId: "noQuery",
          data: { call: objectName === "db" ? `db.${propertyName}` : propertyName },
        });
      },
    };
  },
};

const noControllerPrivateMethodsRule = {
  meta: {
    type: "suggestion",
    docs: { description: "Warn on private controller methods" },
    schema: [],
    messages: {
      privateMethod:
        "Private controller methods are an architecture attention point. Prefer actions, transformers, services, or small local response-only helpers with a documented reason.",
    },
  },
  create(context) {
    if (!filenameIncludes(context, "/app/controllers/")) {
      return {};
    }

    return {
      MethodDefinition(node) {
        if (node.accessibility === "private" || node.key?.type === "PrivateIdentifier") {
          context.report({ node, messageId: "privateMethod" });
        }
      },
    };
  },
};

const noControllerTopLevelFunctionsRule = {
  meta: {
    type: "problem",
    docs: { description: "Disallow top-level helper functions in controller files" },
    schema: [],
    messages: {
      topLevelFunction:
        "Top-level helper functions do not belong in controller files. Move this to an action, service, transformer, or shared utility module.",
    },
  },
  create(context) {
    if (!filenameIncludes(context, "/app/controllers/")) {
      return {};
    }

    return {
      Program(node) {
        for (const statement of node.body ?? []) {
          if (statement.type === "FunctionDeclaration") {
            context.report({ node: statement, messageId: "topLevelFunction" });
            continue;
          }

          if (statement.type !== "VariableDeclaration") {
            continue;
          }

          for (const declaration of statement.declarations ?? []) {
            const initType = declaration.init?.type;
            if (initType === "ArrowFunctionExpression" || initType === "FunctionExpression") {
              context.report({ node: declaration, messageId: "topLevelFunction" });
            }
          }
        }
      },
    };
  },
};

const noControllerRawRequestInputRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw request input APIs in controllers without an explicit marker",
    },
    schema: [],
    messages: {
      rawInput:
        "Raw request input APIs in controllers require @raw-provider-envelope and a reason. Prefer Vine validators.",
    },
  },
  create(context) {
    if (!filenameIncludes(context, "/app/controllers/")) {
      return {};
    }

    return {
      CallExpression(node) {
        if (node.callee?.type !== "MemberExpression") {
          return;
        }

        const propertyName = memberPropertyName(node.callee);
        const objectName = memberObjectName(node.callee);
        if (!["input", "all", "only", "qs", "file", "files"].includes(propertyName)) {
          return;
        }

        if (objectName !== "request" && objectName !== "ctx.request") {
          return;
        }

        if (hasMarker(context, node, RAW_PROVIDER_ENVELOPE)) {
          return;
        }

        context.report({ node, messageId: "rawInput" });
      },
    };
  },
};

const noControllerToControllerDelegationRule = {
  meta: {
    type: "problem",
    docs: { description: "Disallow controller-to-controller imports or construction" },
    schema: [],
    messages: {
      noImport:
        "Controllers must not import other controllers. Extract shared workflow into an action.",
      noNewController:
        "Controllers must not construct other controllers. Extract shared workflow into an action.",
    },
  },
  create(context) {
    if (!filenameIncludes(context, "/app/controllers/")) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (typeof node.source?.value === "string" && node.source.value.includes("#controllers")) {
          context.report({ node, messageId: "noImport" });
        }
      },
      NewExpression(node) {
        if (node.callee?.type === "Identifier" && node.callee.name.endsWith("Controller")) {
          context.report({ node, messageId: "noNewController" });
        }
      },
    };
  },
};

const noUnsafeInertiaPropCastsRule = {
  meta: {
    type: "problem",
    docs: { description: "Disallow unsafe casts in Inertia/controller/transformer response code" },
    schema: [],
    messages: {
      unsafeCast:
        "Avoid '{{cast}}' in response/prop code. Fix transformer/generated Data types instead of casting.",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename?.() ?? "";
    if (
      !filename.includes("/inertia/") &&
      !filename.includes("/app/controllers/") &&
      !filename.includes("/app/transformers/")
    ) {
      return {};
    }

    function reportIfUnsafe(node) {
      const assertedType = node.typeAnnotation?.type;
      if (assertedType === "TSAnyKeyword" || assertedType === "TSNeverKeyword") {
        context.report({
          node,
          messageId: "unsafeCast",
          data: { cast: assertedType === "TSAnyKeyword" ? "as any" : "as never" },
        });
      }
    }

    return {
      TSAsExpression: reportIfUnsafe,
      TSTypeAssertion: reportIfUnsafe,
    };
  },
};

const requireActionExecuteMethodRule = {
  meta: {
    type: "suggestion",
    docs: { description: "Require default-exported action classes to expose execute() only" },
    schema: [],
    messages: {
      missingExecute: "Default-exported action classes should expose an execute() method.",
      extraPublicMethod:
        "Action classes should expose one public execute() method. Move '{{name}}' to a private method or add @action-interface for intentional interfaces.",
    },
  },
  create(context) {
    if (!filenameIncludes(context, "/app/actions/")) {
      return {};
    }

    return {
      ExportDefaultDeclaration(node) {
        const declaration = node.declaration;
        if (declaration?.type !== "ClassDeclaration") {
          return;
        }

        if (hasMarker(context, declaration, ACTION_INTERFACE_EXCEPTION)) {
          return;
        }

        const methods = declaration.body?.body ?? [];
        const publicMethodNames = methods
          .filter((method) => method.type === "MethodDefinition" && method.kind !== "constructor")
          .filter(
            (method) =>
              method.accessibility !== "private" && method.key?.type !== "PrivateIdentifier",
          )
          .map((method) => ({ node: method, name: nodeName(method.key) ?? "<computed>" }));

        if (!publicMethodNames.some((method) => method.name === "execute")) {
          context.report({ node: declaration, messageId: "missingExecute" });
          return;
        }

        for (const method of publicMethodNames) {
          if (method.name !== "execute") {
            context.report({
              node: method.node,
              messageId: "extraPublicMethod",
              data: { name: method.name },
            });
          }
        }
      },
    };
  },
};

const noServiceDomainActionDependencyRule = {
  meta: {
    type: "problem",
    docs: { description: "Disallow services depending on domain actions" },
    schema: [],
    messages: {
      noActionImport:
        "Services should be infrastructure/provider wrappers and must not import actions.",
    },
  },
  create(context) {
    if (!filenameIncludes(context, "/app/services/")) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (typeof node.source?.value === "string" && node.source.value.startsWith("#actions/")) {
          context.report({ node, messageId: "noActionImport" });
        }
      },
    };
  },
};

const requireStructuredErrorLoggingRule = {
  meta: {
    type: "problem",
    docs: { description: "Require logger calls in catch blocks to include { err: error }" },
    schema: [],
    messages: {
      structuredLog:
        "Logger calls inside catch blocks should include the caught error as { err: {{name}} }.",
    },
  },
  create(context) {
    return {
      CatchClause(node) {
        const errorName = node.param?.type === "Identifier" ? node.param.name : null;
        if (!containsLoggerCallWithoutStructuredError(node.body, errorName)) {
          return;
        }

        context.report({
          node,
          messageId: "structuredLog",
          data: { name: errorName ?? "error" },
        });
      },
    };
  },
};

export default {
  meta: {
    name: "airie-conventions",
  },
  rules: {
    "require-expected-error-boundary": requireExpectedErrorBoundaryRule,
    "no-controller-model-mutations": noControllerModelMutationsRule,
    "no-controller-model-queries": noControllerModelQueriesRule,
    "no-controller-private-methods": noControllerPrivateMethodsRule,
    "no-controller-top-level-functions": noControllerTopLevelFunctionsRule,
    "no-controller-raw-request-input": noControllerRawRequestInputRule,
    "no-controller-to-controller-delegation": noControllerToControllerDelegationRule,
    "no-unsafe-inertia-prop-casts": noUnsafeInertiaPropCastsRule,
    "require-action-execute-method": requireActionExecuteMethodRule,
    "no-service-domain-action-dependency": noServiceDomainActionDependencyRule,
    "require-structured-error-logging": requireStructuredErrorLoggingRule,
  },
};
