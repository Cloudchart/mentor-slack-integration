require('dotenv').load()

var path = require('path')
var autoprefixer = require('autoprefixer')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  context: path.resolve(__dirname, '../frontend'),
  entry: {
    javascript: path.resolve(__dirname, '../frontend/javascripts/index.js'),
    stylesheet: path.resolve(__dirname, '../frontend/stylesheets/index.scss')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../public/bundles')
  },
  module: {
    resolve: {
      extensions: ['', '.js', '.scss']
    },
    loaders: [
      {
        test: /\.js$/,
        include: /frontend/,
        loader: 'babel',
      },
      {
        test: /\.json$/,
        include: /frontend/,
        loader: 'json',
      },
      {
        test: /\.scss$/,
        include: /frontend/,
        loader: ExtractTextWebpackPlugin.extract('style', 'css!postcss!sass')
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)(\?.*)?$/,
        include: /frontend/,
        loader: 'url'
      }
    ]
  },
  plugins: [
    new ExtractTextWebpackPlugin('stylesheet.bundle.css', {
      allChunks: true,
      extract: true,
      remove: true
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
        ROOT_URL: JSON.stringify(process.env.ROOT_URL),
      }
    }),

  ],
  postcss: () => {
    return [autoprefixer({ browsers: ['last 2 versions'] })]
  }
}
