/**
 * Path Alias Resolver
 * Resolves TypeScript path aliases (@app/*, @components/*, etc.)
 */

import * as fs from "fs";
import * as path from "path";
import { logger } from "./logger.js";

export interface PathAliases {
  [alias: string]: string[];
}

/**
 * Load path aliases from tsconfig.json
 */
export function loadPathAliases(projectRoot: string): PathAliases {
  const tsconfigPath = path.join(projectRoot, "tsconfig.json");

  if (!fs.existsSync(tsconfigPath)) {
    logger.debug("No tsconfig.json found, using default aliases");
    return getDefaultAliases();
  }

  try {
    const tsconfigContent = fs.readFileSync(tsconfigPath, "utf8");
    // Remove comments from JSON
    const cleanedContent = tsconfigContent.replace(
      /\/\*[\s\S]*?\*\/|\/\/.*/g,
      "",
    );
    const tsconfig = JSON.parse(cleanedContent);

    const paths = tsconfig.compilerOptions?.paths || {};
    const baseUrl = tsconfig.compilerOptions?.baseUrl || ".";

    // Convert paths to absolute paths
    const aliases: PathAliases = {};
    for (const [alias, targets] of Object.entries(paths)) {
      const cleanAlias = alias.replace("/*", "");
      aliases[cleanAlias] = (targets as string[]).map((target) =>
        path.join(projectRoot, baseUrl, target.replace("/*", "")),
      );
    }

    logger.debug(
      `Loaded ${Object.keys(aliases).length} path aliases from tsconfig.json`,
    );
    return aliases;
  } catch (error) {
    logger.warning("Failed to parse tsconfig.json, using default aliases");
    return getDefaultAliases();
  }
}

/**
 * Get default path aliases
 */
function getDefaultAliases(): PathAliases {
  return {
    "@app": ["src/app"],
    "@components": ["src/components"],
    "@pages": ["src/pages"],
    "@hooks": ["src/hooks"],
    "@services": ["src/services"],
    "@utils": ["src/utils"],
    "@styles": ["src/styles"],
    "@assets": ["src/assets"],
  };
}

/**
 * Resolve an import path using aliases
 */
export function resolveAlias(
  importPath: string,
  aliases: PathAliases,
  projectRoot: string,
): string | null {
  for (const [alias, targets] of Object.entries(aliases)) {
    if (importPath.startsWith(alias)) {
      const relativePath = importPath.substring(alias.length);

      // Try each target path
      for (const target of targets) {
        const resolvedPath = path.join(projectRoot, target, relativePath);

        // Try with different extensions
        const extensions = [".ts", ".tsx", ".js", ".jsx", ""];
        for (const ext of extensions) {
          const fullPath = resolvedPath + ext;
          if (fs.existsSync(fullPath)) {
            return fullPath;
          }

          // Try index file
          const indexPath = path.join(resolvedPath, `index${ext}`);
          if (fs.existsSync(indexPath)) {
            return indexPath;
          }
        }
      }
    }
  }

  return null;
}

/**
 * Create Rolldown alias plugin
 */
export function createAliasPlugin(projectRoot: string) {
  const aliases = loadPathAliases(projectRoot);

  return {
    name: "rynex-alias-resolver",
    resolveId(source: string, importer: string | undefined) {
      // Skip external modules
      if (!source.startsWith("@")) {
        return null;
      }

      const resolved = resolveAlias(source, aliases, projectRoot);
      if (resolved) {
        logger.debug(`Resolved alias: ${source} -> ${resolved}`);
        return resolved;
      }

      return null;
    },
  };
}
