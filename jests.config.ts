import type { Config } from 'jest'

// eslint-disable-next-line import/no-unused-modules
export default {
  // preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  coveragePathIgnorePatterns: ['/node_modules/', 'lib/generated/'],
  coverageProvider: 'v8',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '\\.[jt]s$': 'babel-jest',
  },
  setupFilesAfterEnv: ['./tests/setup.ts'],
} satisfies Config
