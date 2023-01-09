/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*',
    '!src/**/index.ts',
  ],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1"
  }
}