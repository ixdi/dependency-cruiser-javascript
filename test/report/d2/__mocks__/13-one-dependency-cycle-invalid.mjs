/** @type {import('../../../../types/dependency-cruiser').ICruiseResult} */
export default {
  modules: [
    {
      source: "aap/noot/mies.js",
      dependencies: [
        {
          resolved: "aap/noot/zus.js",
          module: "#noot/zus.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          moduleSystem: "es6",
          valid: false,
          circular: true,
          cycle: ["aap/noot/mies.js", "aap/noot/zus.js"],
          dependencyTypes: ["aliased", "aliased-subpath-import", "local"],
          rules: [
            {
              severity: "warn",
              name: "pas-de-alez-houpe",
            },
            {
              severity: "error",
              name: "no-cycles",
            },
          ],
        },
      ],
    },
    {
      source: "aap/noot/zus.js",
      dependencies: [
        {
          resolved: "aap/noot/mies.js",
          module: "#noot/mies.js",
          coreModule: false,
          followable: true,
          couldNotResolve: false,
          dynamic: false,
          exoticallyRequired: false,
          matchesDoNotFollow: false,
          moduleSystem: "es6",
          valid: false,
          circular: true,
          cycle: ["aap/noot/zus.js", "aap/noot/mies.js"],
          dependencyTypes: ["aliased", "aliased-subpath-import", "local"],
          rules: [
            {
              severity: "error",
              name: "no-cycles",
            },
          ],
        },
      ],
    },
  ],
  summary: {
    optionsUsed: {},
  },
};
