import plugin from 'tailwindcss/plugin';

const pluginName = 'fat-ui';

export default plugin(function ({ addVariant }) {
  addVariant('dark', '(prefers-color-scheme: dark)');
});
