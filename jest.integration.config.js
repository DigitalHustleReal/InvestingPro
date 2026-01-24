const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost:3000/',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    'server-only': '<rootDir>/__mocks__/server-only.js',
    '@upstash/redis': '<rootDir>/__mocks__/@upstash/redis.js',
    // '@supabase/supabase-js': '<rootDir>/__mocks__/@supabase/supabase-js.js', // COMMENTED OUT FOR INTEGRATION
    '@supabase/ssr': '<rootDir>/__mocks__/@supabase/ssr.js',
    '@/lib/workflows/hooks/article-workflow-hooks': '<rootDir>/__mocks__/article-workflow-hooks.js',
  },
  testMatch: [
    '**/__tests__/integration/**/*.test.[jt]s?(x)',
  ],
  transform: {
    // Use babel-jest to transform JS/TS files
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(marked|uuid|nanoid|@anthropic-ai|@google|@mdx-js|remark|rehype|unist|vfile|@supabase)/)',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = async () => {
  const config = await createJestConfig(customJestConfig)()
  
  // Custom transformIgnorePatterns to allow transforming ESM modules
  config.transformIgnorePatterns = [
    // Transform specifically these packages that are ESM only
    '/node_modules/(?!(marked|uuid|nanoid|@anthropic-ai|@google|@mdx-js|remark|rehype|unist|vfile|@supabase)/)',
  ]
  
  return config
}
