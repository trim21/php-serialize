const typescript = require('@rollup/plugin-typescript')

const pkg = require('./package.json')


module.exports = {
  input: './src/index.ts',
  plugins: [
    typescript({
      tsconfig: 'tsconfig.build.json',
    }),
  ],
  output: [
    // ES module (for bundlers) build.
    {
      format: 'esm',
      file: pkg.module,
      sourcemap: true,
      sourcemapExcludeSources: false,
    },
  ],
}
