
const { createClient } = require('./supabase-js');

module.exports = {
  createBrowserClient: createClient,
  createServerClient: createClient,
};
