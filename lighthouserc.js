module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm --filter web start',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 30000,

      url: [
        'http://localhost:3000/',
        'http://localhost:3000/category/woods',
      ],

      numberOfRuns: 3,

      settings: {
        maxWaitForLoad: 45000,
        chromeFlags: '--no-sandbox --headless --disable-gpu --disable-dev-shm-usage',
        throttlingMethod: 'simulate',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    },

    assert: {
      assertions: {
        // Performance: warn at 60%, fail at 40%
        'categories:performance': ['warn', { minScore: 0.6 }],

        // Accessibility: fail at 80%
        'categories:accessibility': ['error', { minScore: 0.8 }],

        // Best Practices: warn at 60%
        'categories:best-practices': ['warn', { minScore: 0.6 }],

        // SEO: warn at 60%
        'categories:seo': ['warn', { minScore: 0.6 }],

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
      },
    },

    upload: {
      target: 'temporary-public-storage',
    },
  },
};
