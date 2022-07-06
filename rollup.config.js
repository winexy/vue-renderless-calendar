import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';
import sourcemaps from 'rollup-plugin-sourcemaps';
import fs from 'fs';
import path from 'path';
import pkg from './package.json';

const isProductionBuild = process.env.NODE_ENV === 'production';
const isBuildForExamples = process.env.TARGET === 'examples';
const { log } = console;

const localesList = fs.readdirSync(path.join(__dirname, 'lib', 'locale'));
const locales = localesList.map(createLocaleConfig);

function createOutputAssets({ dir }) {
  return [
    {
      sourcemap: !isProductionBuild,
      format: 'es',
      dir,
      entryFileNames: '[name].es.js',
    },
    {
      sourcemap: !isProductionBuild,
      format: 'cjs',
      dir,
    },
  ];
}

function createExampleOutputs() {
  const examples = fs
    .readdirSync(path.join(__dirname, 'examples'))
    .filter(example => example !== 'README.md');

  log('Create example outputs', examples);

  return examples.flatMap(example => {
    const exampleDir = path.join('examples', example, 'dist');
    log('Example dir', exampleDir);
    return createOutputAssets({ dir: exampleDir });
  });
}

function createLocaleConfig(locale) {
  return {
    input: path.join('lib', 'locale', locale),
    output: isBuildForExamples
      ? createExampleOutputs()
      : createOutputAssets({ dir: path.join('dist', 'locale') }),
    plugins: [buble(), isProductionBuild && terser()],
  };
}

export default [
  {
    input: path.join('lib', 'index.js'),
    external: Object.keys(pkg.dependencies),
    output: isBuildForExamples
      ? createExampleOutputs()
      : createOutputAssets({ dir: 'dist' }),
    plugins: [
      buble(),
      !isProductionBuild && sourcemaps(),
      isProductionBuild && terser(),
    ],
  },
  ...locales,
];
