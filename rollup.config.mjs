import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      compilerOptions: {
        sourceRoot: '../../src/',
        // noEmit: false,
        outDir: './dist/types/',
        rootDir: './src/',
      },
      // include: ['./src/'],
      exclude: ['node_modules', 'lib', 'test', 'dist', 'public'],
    }),
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: 'esm',
      file: 'dist/index.mjs',
      sourcemap: true,
      sourcemapExcludeSources: false,
    },
    // ES module (for bundlers) build.
    {
      format: 'cjs',
      file: 'dist/index.cjs',
      sourcemap: true,
      sourcemapExcludeSources: false,
    },
  ],
}
