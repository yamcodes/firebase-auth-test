import { defineConfig } from 'tsup';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default defineConfig([
  {
    entry: ['src/components/index.ts'],
    outDir: 'dist',
    splitting: false,
    treeshake: true,
    minify: false,
    dts: {
      entry: 'src/components/index.ts',
    },
    sourcemap: 'inline',
    clean: false,
    format: ['cjs', 'esm'],
    shims: true,
    injectStyle: false,
    external: ['react', 'react-dom'],
    noExternal: ['hooks', 'utilities'],
  },
]);
