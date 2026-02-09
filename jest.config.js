import { createDefaultEsmPreset } from 'ts-jest';

const tsJestPreset = createDefaultEsmPreset();

export default {
  ...tsJestPreset,
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
