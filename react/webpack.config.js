const path = require('path')
const glob = require('glob')
const nodeModules = path.resolve(__dirname, 'node_modules')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const HappyPack = require('happypack')
const autoprefixer = require('autoprefixer')
const fs = require('fs');

process.traceDeprecation = true
process.noDeprecation = true

const env = process.env.NODE_ENV
const devchunck = []

function generatorEntry() {
  const entry = {}
  const rootPath = path.resolve(__dirname, 'app')
  const files = glob.sync(path.join(rootPath, '**/main.+(js|jsx)'))

  files.forEach((file) => {
    const fileBasePath = file.replace('/main.js', '')
    const folderName = path.relative(rootPath, fileBasePath) || path.basename(fileBasePath)
    if (env !== 'dev' || devchunck.length === 0) {
      entry[folderName] = [file]
    } else if (devchunck.indexOf(folderName) >= 0) {
      entry[folderName] = [file]
    }
  })

  return entry
}

function generateChunckList() {
  const rootPath = path.resolve(__dirname, 'app')
  const files = glob.sync(path.join(rootPath, '**/main.+(js|jsx)'))

  return files.map((file) => {
    const fileBasePath = file.replace('/main.js', '')
    return path.relative(rootPath, fileBasePath) || path.basename(fileBasePath)
  })
}

function generateHtml(chunck) {
  return new HtmlWebpackPlugin({
    template: path.join(__dirname, 'build/vendor/template/index.build.ejs'),
    filename: `${chunck}/index.html`,
    chunks: [chunck],
    cache: true,
  })
}

const config = {
  devtool: env === 'dev' && 'source-map',
  entry: generatorEntry(),
  resolve: {
    alias: {
      comps: path.resolve(__dirname, 'app', 'components'),
      assets: path.resolve(__dirname, 'app', 'assets'),
      sspquery: path.resolve(__dirname, 'app', 'kits/api/sspquery'),
      utils: path.resolve(__dirname, 'app', 'kits/utils'),
      scss: path.resolve(__dirname, 'app', 'assets/css'),
      imgs: path.resolve(__dirname, 'app', 'assets/img'),
    },
    extensions: ['.web.js', '.js', '.jsx', '.json'],
  },
  output: {
    path: env === 'dev' ? path.resolve(__dirname, 'build', 'dev') : path.resolve(__dirname, 'build', 'dist'),
    publicPath: env === 'dev' ? '../' : '../',
    filename: env === 'dev' ? 'js/[name].[hash:8].js' : 'js/[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [nodeModules],
        loader: 'happypack/loader?id=js',
      }, {
        test: /\.s?css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        })
      },{
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[sha512:hash:base64:7].[ext]'
        },
        exclude: [nodeModules],
      }, {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[sha512:hash:base64:7].[ext]'
        },
        exclude: [nodeModules],
      }, {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          name: 'name=html/[name].[ext]'
        },
        exclude: [nodeModules],
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ filename: '[name].[chunkhash:8].css', disable: false, allChunks: true }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new HappyPack({
      id: 'js',
      threads: 4,
      cache: true,
      loaders: [
        {
          path: 'babel-loader',
          query: {
            cacheDirectory: true,
            presets: ['es2015', 'react', 'stage-0', 'stage-1', 'stage-3'],
            plugins: [
              ['import', { style: 'css', libraryName: 'antd-mobile' }],
              'transform-decorators-legacy',
            ]
          }
        }
      ],
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),

    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(path.join(__dirname, 'build/vendor/manifest.json')),
    }),

    new CopyWebpackPlugin([
      { from: 'build/vendor/js', to: env === 'dev' ? path.join(__dirname, 'build/dev/js') : path.join(__dirname, 'build/dist/js') },
    ], {
      ignore: [
        '.DS_Store',
      ],
    }),

    new CopyWebpackPlugin([
      { from: 'favicon.ico', to: env === 'dev' ? path.join(__dirname, 'build/dev') : path.join(__dirname, 'build/dist') },
    ]),

    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [
          autoprefixer({ browsers: ['last 3 versions', 'Firefox ESR', '> 1%', 'ie >= 8'] })
        ]
      }
    }),
  ]
}

if (env !== 'dev') {
  config.plugins = config.plugins.concat(
    generateChunckList().map((chunck) => generateHtml(chunck))
  )
  config.plugins = config.plugins.concat([
    new CleanWebpackPlugin(['build/dist/*'], {
      root: __dirname,
      verbose: true,
      dry: false,
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
        sourceMap: true
      },
    }),

  ])
} else {
  console.log('dev chunch size:', devchunck.length)
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.plugins = config.plugins.concat(
    (devchunck.length === 0) ? generateChunckList().map((chunck) => generateHtml(chunck))
    : devchunck.map((chunck) => generateHtml(chunck))
  )
}

module.exports = config
