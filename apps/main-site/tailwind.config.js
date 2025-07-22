import sharedConfig from '@encodly/shared-ui/tailwind.config.js';

export default {
  ...sharedConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};