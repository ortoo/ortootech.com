const PROD = JSON.parse(process.env.PROD || '0');

if (PROD) {
  process.env.NODE_ENV = 'production';
}

const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const settings = require('config');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('styles/[name].[contenthash].css');

var config = {
  context: path.resolve(__dirname, 'src'),
  output: {
    filename: 'scripts/[name].[chunkhash].js',
    path: path.resolve(__dirname, 'build'),
    // publicPath: `${settings.ASSETS_LOC}/`,
    sourceMapFilename: 'sources/[file].map'
  },

  entry: {
    index: './index.js'
  },
  module: {
    loaders: [
      {
        test: /\.pug$/,
        loader: 'pug'
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: extractCSS.extract(['css', 'postcss', 'sass'])
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract(['css', 'postcss'])
      },
      {
        test: /\.(woff|ttf|svg|woff2|eot)(\?.*)?$/,
        loader: 'file?name=fonts/[name].[hash].[ext]'
      },
      {
        test: /\.(gif|png|jpg|bmp|jpeg|ico)(\?.*)?$/,
        loader: 'file?name=images/[name].[hash].[ext]'
      }
    ]
  },
  plugins: [
    // new ChunkManifestPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      __CONFIG__: JSON.stringify(settings),
      PROD: PROD,
      VERSION: JSON.stringify(process.env.APP_VERSION || 'dev')
    }),
    // new CleanWebpackPlugin(['build']),
    extractCSS,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.pug',
      inject: false
    })
  ],

  resolve: { fallback: path.join(__dirname, 'node_modules') },
  resolveLoader: { fallback: path.join(__dirname, 'node_modules') },

  postcss: function() {
    return [autoprefixer({
      browsers: [
        'last 2 versions',
        'iOS >= 7',
        'Android >= 4',
        'Explorer >= 11',
        'ExplorerMobile >= 11'
      ],
      cascade: false
    })];
  }
};

if (PROD) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: true
    })
  );
  config.devtool = 'source-map';
} else {
  config.devtool = 'inline-source-map';
}

module.exports = config;
