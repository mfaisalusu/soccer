/**
 * Production Environment Configuration
 */

export const environment = {
  production: true,
  apiUrl: 'https://api.football-data.org/v4',
  apiKey: process.env['WORLD_CUP_API_KEY'] || 'YOUR_API_KEY',
  cacheTime: 3600000 // 1 hour in milliseconds
};
