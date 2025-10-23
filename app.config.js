// app.config.js  (Windows-friendly)
// Reads .env at config time so extra.* are real strings inside the app.
require('dotenv').config();

module.exports = {
  expo: {
    name: 'ReelMates',
    slug: 'reelmates',
    scheme: 'reelmates',
    plugins: ['expo-router'],
    platforms: ['ios', 'android'], // leave out "web" for now
    extra: {
      TMDB_V4: process.env.TMDB_V4,
      TMDB_KEY: process.env.TMDB_KEY,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON: process.env.SUPABASE_ANON,
    },
  },
};
