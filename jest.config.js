import { createDefaultEsmPreset } from 'ts-jest';

const tsJestPreset = createDefaultEsmPreset();

export default {
  ...tsJestPreset,
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
