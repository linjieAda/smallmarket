const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

module.exports = {
  entry: {
    vendors: [
      'cookies-js',
      'es6-promise',
      'fastclick',
      'isomorphic-fetch',
      'mobx',
      'mobx-react',
      'react',
      'react-dom',
      'utf8'
    ],
  },

  output: {
    path: path.resolve(__dirname, 'build', 'vendor'),
    filename: 'js/[name].[hash:8].js',
    library: '[name]_library',
  },

  plugins: [
    new CleanWebpackPlugin(['build/vendor'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),

    new webpack.DllPlugin({
      path: path.join(__dirname, 'build/vendor/manifest.json'),
      name: '[name]_library',
      context: __dirname,
    }),

    new HtmlWebpackPlugin({
      template: 'template/index.ejs',
      filename: 'template/index.build.ejs',
    }),

    new ParallelUglifyPlugin({
      uglifyJS: {
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          screw_ie8: true,
          warnings: false,
          drop_debugger: true,
          drop_console: true,
        },
      },
    }),

  ],
}
