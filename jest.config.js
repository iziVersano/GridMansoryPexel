export default {
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/client/src/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/client/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/client/src/**/*.(test|spec).(ts|tsx)',
  ],
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],
};
