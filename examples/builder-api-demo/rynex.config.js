export default {
  entry: "src/index.ts",
  output: "dist/bundle.js",
  minify: false,  // Development mode
  sourceMaps: true,
  port: 3000,
  hotReload: true,
  html: {
    title: "Rynex Builder API Demo",
    description: "Demonstrating Rynex Builder API with full reactivity",
    lang: "en",
    meta: {
      "author": "Rynex Team",
      "keywords": "rynex, framework, reactive, javascript"
    },
    inlineStyles: true
  }
};
