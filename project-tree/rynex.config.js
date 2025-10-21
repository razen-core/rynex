export default {
  entry: 'src/index.ts',
  output: 'dist/index.js',
  minify: false,
  sourceMaps: true,
  port: 3000,
  hotReload: true,
  routing: {
    mode: 'history',
    base: '/',
    fileBasedRouting: true,
    pagesDir: 'src/pages',
    scrollBehavior: 'smooth',
    trailingSlash: false
  },
  routes: [
    {
      path: '/',
      component: 'dist/pages/home/page.html'
    },
    {
      path: '/about',
      component: 'dist/pages/about/page.html'
    }
  ]
};
