import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';

const production = process.env.NODE_ENV === 'production';

export default {
  input: 'lib/index.js',
  output: {
    format: 'es',
    file: 'dist/index.js'
  },
  plugins: [
    buble(),
    production && terser()
  ]
};
