module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'jest-transform-stub'
  },
  testMatch: [
    '**/tests/unit/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!src/views/DailyConfirmations.vue',
    '!**/node_modules/**'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(@vue|vuelidate)/)'
  ]
};
