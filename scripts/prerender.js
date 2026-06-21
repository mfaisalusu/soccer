/**
 * Pre-rendering script for SSG
 * Generates static pages for better performance and SEO
 */

const prerender = require('prerender-ssg');
const path = require('path');

const config = {
  // Routes to pre-render
  routes: [
    '/',
    '/matches',
    '/matches?stage=group-stage',
    '/matches?stage=knockout',
  ],

  // Output directory
  outDir: path.join(__dirname, '../dist/world-cup-schedule'),

  // Base app URL
  baseUrl: 'http://localhost:4200',

  // Wait time for JS to render
  waitTime: 3000,

  // Remove index.html from URLs
  minify: true,

  // Static file extensions to copy
  staticExtensions: ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg'],

  // Excluded routes
  exclude: ['/admin', '/api']
};

// Run pre-rendering
prerender(config)
  .then(() => {
    console.log('Pre-rendering completed successfully!');
  })
  .catch(error => {
    console.error('Pre-rendering failed:', error);
    process.exit(1);
  });
