/**
 * HTML Generator
 * Auto-generates index.html for Rynex projects
 */

export interface HTMLGeneratorOptions {
  title?: string;
  description?: string;
  lang?: string;
  charset?: string;
  viewport?: string;
  bundlePath: string;
  stylePath?: string;
  favicon?: string;
  meta?: Record<string, string>;
  inlineStyles?: string;
  buildHash?: string;
}

/**
 * Generate HTML template for Rynex application
 */
export function generateHTML(options: HTMLGeneratorOptions): string {
  const {
    title = 'Rynex App',
    description = 'Built with Rynex Framework',
    lang = 'en',
    charset = 'UTF-8',
    viewport = 'width=device-width, initial-scale=1.0',
    bundlePath,
    stylePath = 'styles.css',
    favicon,
    meta = {},
    inlineStyles,
    buildHash
  } = options;

  // Build meta tags
  const metaTags = [
    `<meta charset="${charset}" />`,
    `<meta name="viewport" content="${viewport}" />`,
    `<meta name="description" content="${description}" />`,
  ];

  // Add cache control headers for production
  if (buildHash) {
    metaTags.push(
      `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />`,
      `<meta http-equiv="Pragma" content="no-cache" />`,
      `<meta http-equiv="Expires" content="0" />`,
      `<meta name="build-version" content="${buildHash}" />`
    );
  }

  // Add custom meta tags
  for (const [name, content] of Object.entries(meta)) {
    metaTags.push(`<meta name="${name}" content="${content}" />`);
  }

  // Build link tags
  const linkTags = [];
  if (favicon) {
    linkTags.push(`<link rel="icon" href="${favicon}" />`);
  }
  if (stylePath) {
    linkTags.push(`<link rel="stylesheet" href="${stylePath}" />`);
  }

  // Build inline styles
  const inlineStyleTag = inlineStyles
    ? `<style>\n${inlineStyles}\n</style>`
    : '';

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  ${metaTags.join('\n  ')}
  <title>${title}</title>
  ${linkTags.join('\n  ')}
  ${inlineStyleTag}
</head>
<body>
  <div id="app"></div>
  <script type="module" src="${bundlePath}"></script>
</body>
</html>
`;
}

/**
 * Generate default inline styles
 */
export function getDefaultInlineStyles(): string {
  return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}`;
}

/**
 * Read HTML config from rynex.config.js if available
 */
export interface HTMLConfig {
  title?: string;
  description?: string;
  lang?: string;
  meta?: Record<string, string>;
  favicon?: string;
  inlineStyles?: boolean;
}

/**
 * Generate HTML with config
 */
export function generateHTMLWithConfig(
  bundlePath: string,
  htmlConfig: HTMLConfig = {},
  buildHash?: string
): string {
  const options: HTMLGeneratorOptions = {
    ...htmlConfig,
    bundlePath,
    buildHash,
    inlineStyles: htmlConfig.inlineStyles !== false ? getDefaultInlineStyles() : undefined
  };

  return generateHTML(options);
}
