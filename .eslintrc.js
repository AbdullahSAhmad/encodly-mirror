module.exports = {
  root: true,
  extends: ['./packages/shared-config/eslint/base.cjs'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './packages/*/tsconfig.json', './apps/*/tsconfig.json'],
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '.eslintrc.js', 'vite.config.ts'],
};