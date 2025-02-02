import { deepEqual } from "node:assert/strict";
import { getAliasTypes } from "#extract/resolve/module-classifiers.mjs";

describe("[I] extract/resolve/module-classifiers - getAliasTypes", () => {
  it("returns an empty array for non-aliased modules", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(getAliasTypes("fs", "fs", lResolveOptions, lManifest), []);
  });

  it("returns aliased and aliased-subpath-import for subpath imports", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      imports: {
        "#*": "./src/*",
      },
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "#some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-subpath-import"],
    );
  });

  it("doesn't run aliased and aliased-subpath-import when a thing starts with #, but it isn't in the imports", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      imports: {
        "#different/things": "./lib/*",
      },
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "#some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      [],
    );
  });

  it("doesn't run aliased and aliased-subpath-import when a thing starts with #, but there are no imports", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "#some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      [],
    );
  });

  it("returns aliased and aliased-webpack for webpack aliases", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "@some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-webpack"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (literals)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: [
        "packages/b-package",
        "packages/a-package",
        "packages/c-package",
      ],
    };
    const lResolveOptions = {
      baseDirectory: "over/the/rainbow",
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (globs)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["packages/*"],
    };
    const lResolveOptions = {};
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (glob ending with /)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["*/"],
    };
    const lResolveOptions = {};
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (convoluted glob)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["*/?-package"],
    };
    const lResolveOptions = {};
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("returns aliased and aliased-workspace for workspace alias (even when the symlink isn't followed)", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["*/?-package"],
    };
    const lResolveOptions = {};
    deepEqual(
      getAliasTypes(
        "some-workspaced-local-package",
        "node_modules/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-workspace"],
    );
  });

  it("doesn't run aliased and aliased-workspace for when resolved matches a workspace, but module requested is relative", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["*/?-package"],
    };
    const lResolveOptions = {};
    deepEqual(
      getAliasTypes(
        "../a-package/some-workspaced-local-package",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      [],
    );
  });

  it("classifies as a webpack alias if it could be both a webpack alias _and_ a workspace alias", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      workspaces: ["*/?-package"],
    };
    const lResolveOptions = {
      alias: {
        "@": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "@some/thing.js",
        "packages/a-package/index.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-webpack"],
    );
  });

  it("classifies as a webpack alias if it could be both a webpack alias _and_ a subpath import", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
      imports: {
        "#*": "./src/*",
      },
    };
    const lResolveOptions = {
      alias: {
        "#": "./src",
      },
    };
    deepEqual(
      getAliasTypes(
        "#some/thing.js",
        "src/some/thing.js",
        lResolveOptions,
        lManifest,
      ),
      ["aliased", "aliased-webpack"],
    );
  });

  it("should return aliased, aliased-tsconfig and aliased-tsconfig-paths for tsconfig paths", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lTranspileOptions = {
      tsConfig: {
        options: {
          paths: {
            "@tsconfig/*": ["./src/*"],
          },
        },
      },
    };
    deepEqual(
      getAliasTypes(
        "@tsconfig/package",
        "src/package/index.js",
        {},
        lManifest,
        lTranspileOptions,
      ),
      ["aliased", "aliased-tsconfig", "aliased-tsconfig-paths"],
    );
  });

  it("should return aliased, aliased-tsconfig and aliased-tsconfig-base-url when it matches tsconfig base urls", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lTranspileOptions = {
      tsConfig: {
        options: {
          baseUrl: "./src",
          paths: {
            "@tsconfig/*": ["./something-else/*"],
          },
        },
      },
    };
    deepEqual(
      getAliasTypes(
        "package",
        "src/package/index.js",
        {},
        lManifest,
        lTranspileOptions,
      ),
      ["aliased", "aliased-tsconfig", "aliased-tsconfig-base-url"],
    );
  });

  it("should NOT return aliased, aliased-tsconfig and aliased-tsconfig-base-url when it's a core module", () => {
    const lManifest = {
      name: "test",
      version: "1.0.0",
      dependencies: {},
    };
    const lTranspileOptions = {
      tsConfig: {
        options: {
          baseUrl: "./",
          paths: {
            "@tsconfig/*": ["./something-else/*"],
          },
        },
      },
    };
    deepEqual(getAliasTypes("fs", "fs", {}, lManifest, lTranspileOptions), []);
  });
});
