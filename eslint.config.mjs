import nextConfigs from "eslint-config-next/core-web-vitals";
import { fixupPluginRules } from "@eslint/compat";

// eslint-config-next bundles @babel/eslint-parser which returns a scope manager
// that does not implement the addGlobals() method required by ESLint v10.
// This wrapper polyfills it using the same contract as eslint-scope's ScopeManager.
function withAddGlobals(parser) {
  return {
    ...parser,
    parseForESLint(text, options) {
      const result = parser.parseForESLint(text, options);
      if (result.scopeManager && !result.scopeManager.addGlobals) {
        result.scopeManager.addGlobals = function (names) {
          const globalScope = this.scopes?.[0];
          if (!globalScope) return;
          for (const name of names) {
            if (!globalScope.set.has(name)) {
              const variable = {
                name,
                identifiers: [],
                references: [],
                defs: [],
                tainted: false,
                stack: true,
                scope: globalScope,
              };
              globalScope.set.set(name, variable);
              globalScope.variables?.push(variable);
            }
          }
        };
      }
      return result;
    },
  };
}

const configs = Array.isArray(nextConfigs) ? nextConfigs : [nextConfigs];

export default configs.map((config) => {
  let updated = config;

  if (updated.languageOptions?.parser?.meta?.name === "eslint-config-next/parser") {
    updated = {
      ...updated,
      languageOptions: {
        ...updated.languageOptions,
        parser: withAddGlobals(updated.languageOptions.parser),
      },
    };
  }

  if (updated.plugins) {
    const fixedPlugins = {};
    for (const [name, plugin] of Object.entries(updated.plugins)) {
      fixedPlugins[name] = fixupPluginRules(plugin);
    }
    updated = { ...updated, plugins: fixedPlugins };
  }

  return updated;
});
