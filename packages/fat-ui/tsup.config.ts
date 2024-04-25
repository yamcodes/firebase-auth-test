import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
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
    noExternal: ['hooks', 'utilities'],
  },
]);
