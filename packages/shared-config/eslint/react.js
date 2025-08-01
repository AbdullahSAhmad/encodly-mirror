module.exports = {
  extends: [
    './base.js',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};