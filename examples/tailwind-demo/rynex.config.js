export default {
  entry: "src/index.ts",
  output: "dist/bundel.js",
  minify: true,  // Development mode
  sourceMaps: true,
  port: 3001,
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
    title: "Rynex + Tailwind CSS v4 Demo",
    description: "Demonstrating Rynex Builder API with Tailwind CSS v4",
    lang: "en",
    meta: {
      "author": "Rynex Team",
      "keywords": "rynex, framework, reactive, tailwindcss, javascript"
    }
  }
};
