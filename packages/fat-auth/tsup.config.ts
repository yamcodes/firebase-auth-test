import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export -- tsup config
export default defineConfig([
  {
    entry: ['core/index.ts'],
    outDir: 'core/dist',
    splitting: false,
    treeshake: true,
    minify: true,
    dts: true,
    sourcemap: 'inline',
    clean: false,
    format: ['cjs', 'esm'],
    shims: true,
    injectStyle: false,
    external: ['react', 'react-dom'],
    noExternal: ['hooks'],
  },
  {
    entry: ['react/index.ts'],
    outDir: 'react/dist',
    splitting: false,
    treeshake: true,
    minify: true,
    dts: true,
    sourcemap: 'inline',
    clean: false,
    format: ['cjs', 'esm'],
    shims: true,
    injectStyle: false,
    external: ['react', 'react-dom'],
    noExternal: ['hooks'],
  },
]);
