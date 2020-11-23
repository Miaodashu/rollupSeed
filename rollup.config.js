import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
// import commonjs from 'rollup-plugin-commonjs';
import merge from 'webpack-merge';
import {uglify} from 'rollup-plugin-uglify';

let config = {
  input: 'src/index.js',
  output: {
    name:'mdsdk',
    file: 'dist/md-sdk.js',
    format: 'umd'
  },
  plugins: [
    resolve(),
    // commonjs({
    //   include: /node_modules/
    // }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
let [min, es, cjs] = [merge({}, config), merge({}, config), merge({}, config)];

min.output.file = 'dist/md-sdk.min.js';
min.plugins.unshift(uglify());

es.output.file = 'dist/md-sdk.es.js';
es.output.format = 'es';

// cjs.output.file = 'dist/md-sdk.cjs.js';
// cjs.output.format = 'cjs';

export default [config, min, es, cjs];