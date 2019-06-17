import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';
import fs from 'fs';
import path from 'path';

const production = process.env.NODE_ENV === 'production';

const localesList = fs.readdirSync(path.join(__dirname, 'lib', 'locale'));
const locales = localesList.map(createLocaleConfig);

function createLocaleConfig(locale) {
  return {
    input: path.join('lib', 'locale', locale),
    output: {
      format: 'es',
      file: path.join('dist', 'locale', locale)
    },
    plugins: [
      buble(),
      production && terser()
    ]
  };
}

export default [{
  input: path.join('lib', 'index.js'),
  output: {
    format: 'es',
    file: path.join('dist', 'index.js')
  },
  plugins: [
    buble(),
    production && terser()
  ]
}, ...locales];
