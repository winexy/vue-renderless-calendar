import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';
import sourcemaps from 'rollup-plugin-sourcemaps';
import fs from 'fs';
import path from 'path';

const production = process.env.NODE_ENV === 'production';

const localesList = fs.readdirSync(path.join(__dirname, 'lib', 'locale'));
const locales = localesList.map(createLocaleConfig);

function createLocaleConfig(locale) {
  return {
    input: path.join('lib', 'locale', locale),
    output: [
      {
        format: 'es',
        dir: 'dist/locale',
        entryFileNames: '[name].es.js'
      },
      {
        format: 'cjs',
        dir: 'dist/locale'
      }
    ],
    plugins: [
      buble(),
      production && terser()
    ]
  };
}

export default [{
  input: path.join('lib', 'index.js'),
  output: [
    {
      sourcemap: !production,
      format: 'es',
      dir: 'dist',
      entryFileNames: '[name].es.js'
    },
    {
      sourcemap: !production,
      format: 'cjs',
      dir: 'dist'
    }
  ],
  plugins: [
    buble(),
    !production && sourcemaps(),
    production && terser()
  ]
}, ...locales];
