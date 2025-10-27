/**
 * Init CSS Command
 * Initialize Tailwind CSS v4 setup for Rynex project
 */

import * as fs from "fs";
import * as path from "path";
import { logger } from "./logger.js";
import {
  generatePostCSSConfig,
  generateTailwindEntry,
  checkCSSSetup,
} from "./css-processor.js";
import { loadConfig } from "./config.js";

/**
 * Initialize Tailwind CSS setup
 */
export async function initCSS(): Promise<void> {
  const projectRoot = process.cwd();

  logger.info("Initializing Tailwind CSS v4 for Rynex\n");

  // Check if dependencies are installed
  const cssSetup = checkCSSSetup(projectRoot);

  if (!cssSetup.hasTailwind || !cssSetup.hasPostCSS) {
    logger.error("Required dependencies not found!\n");
    logger.info("Please install Tailwind CSS v4 dependencies:\n");
    logger.info(
      "  pnpm add -D tailwindcss @tailwindcss/postcss postcss postcss-cli autoprefixer",
    );
    logger.info("  # or");
    logger.info(
      "  npm install --save-dev tailwindcss @tailwindcss/postcss postcss postcss-cli autoprefixer\n",
    );
    process.exit(1);
  }

  logger.success("Dependencies found");

  // Generate PostCSS config
  logger.info("\nCreating PostCSS configuration...");
  generatePostCSSConfig(projectRoot);

  // Generate CSS entry file
  logger.info("Creating CSS entry file...");
  const cssEntry = "src/styles/main.css";
  generateTailwindEntry(projectRoot, cssEntry);

  // Update rynex.config.js
  logger.info("Updating Rynex configuration...");
  await updateRynexConfig(projectRoot);

  // Create example component
  logger.info("Creating example component...");
  createExampleComponent(projectRoot);

  logger.success("\nTailwind CSS v4 setup complete!\n");
  logger.info("Next steps:");
  logger.info("  1. Run: rynex dev");
  logger.info("  2. Your CSS will be automatically compiled");
  logger.info("  3. Start using Tailwind classes in your components\n");
  logger.info("Example usage:");
  logger.info('  div({ class: "bg-blue-500 text-white p-4 rounded-lg" })\n');
  logger.info("Documentation: https://tailwindcss.com/docs\n");
}

/**
 * Update rynex.config.js to enable CSS processing
 */
async function updateRynexConfig(projectRoot: string): Promise<void> {
  const configPath = path.join(projectRoot, "rynex.config.js");

  if (!fs.existsSync(configPath)) {
    // Create new config
    const config = `export default {
  entry: 'src/index.ts',
  output: 'dist/bundle.js',
  minify: false,
  sourceMaps: true,
  port: 3000,
  hotReload: true,

  // Tailwind CSS configuration
  css: {
    enabled: true,
    entry: 'src/styles/main.css',
    output: 'dist/styles.css',
    minify: false,
    sourcemap: true,
  },

  html: {
    title: 'My Rynex App',
    description: 'Built with Rynex and Tailwind CSS',
  }
};
`;
    fs.writeFileSync(configPath, config, "utf8");
    logger.success("Created rynex.config.js");
    return;
  }

  // Update existing config
  let configContent = fs.readFileSync(configPath, "utf8");

  // Check if CSS config already exists
  if (configContent.includes("css:") || configContent.includes("css {")) {
    logger.info("CSS configuration already exists in rynex.config.js");
    return;
  }

  // Add CSS config before the closing brace
  const cssConfig = `
  // Tailwind CSS configuration
  css: {
    enabled: true,
    entry: 'src/styles/main.css',
    output: 'dist/styles.css',
    minify: false,
    sourcemap: true,
  },`;

  // Find the last closing brace and insert before it
  const lastBraceIndex = configContent.lastIndexOf("}");
  if (lastBraceIndex !== -1) {
    configContent =
      configContent.slice(0, lastBraceIndex) +
      cssConfig +
      "\n" +
      configContent.slice(lastBraceIndex);

    fs.writeFileSync(configPath, configContent, "utf8");
    logger.success("Updated rynex.config.js with CSS configuration");
  } else {
    logger.warning("Could not automatically update rynex.config.js");
    logger.info("Please add the following to your config:\n");
    logger.info(cssConfig);
  }
}

/**
 * Create example component with Tailwind classes
 */
function createExampleComponent(projectRoot: string): void {
  const componentDir = path.join(projectRoot, "src", "components");

  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }

  const examplePath = path.join(componentDir, "TailwindExample.ts");

  if (fs.existsSync(examplePath)) {
    logger.info("Example component already exists");
    return;
  }

  const example = `import { vbox, text, button } from 'rynex/helpers';

/**
 * Example component using Tailwind CSS with Builder API
 */
export function TailwindExample() {
  return vbox()
    .class('min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8')
    .add([
      vbox()
        .class('bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full')
        .gap(1.5)
        .add([
          text('Tailwind CSS v4')
            .class('text-3xl font-bold text-gray-800')
            .build(),

          text('Your Rynex project is now powered by Tailwind CSS!')
            .class('text-gray-600')
            .build(),

          vbox()
            .class('space-y-3')
            .gap(0.75)
            .add([
              vbox()
                .class('bg-blue-50 border-l-4 border-blue-500 p-4 rounded')
                .add([
                  text('Zero configuration')
                    .class('text-blue-800 font-semibold')
                    .build()
                ])
                .build(),

              vbox()
                .class('bg-green-50 border-l-4 border-green-500 p-4 rounded')
                .add([
                  text('Automatic content detection')
                    .class('text-green-800 font-semibold')
                    .build()
                ])
                .build(),

              vbox()
                .class('bg-purple-50 border-l-4 border-purple-500 p-4 rounded')
                .add([
                  text('CSS-first configuration')
                    .class('text-purple-800 font-semibold')
                    .build()
                ])
                .build()
            ])
            .build(),

          button('Get Started')
            .class('mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors transform hover:scale-105')
            .click(() => {
              console.log('Ready to build amazing things!');
            })
            .build()
        ])
        .build()
    ])
    .build();
}
`;

  fs.writeFileSync(examplePath, example, "utf8");
  logger.success(
    "Created example component: src/components/TailwindExample.ts",
  );
}
