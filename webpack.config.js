const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'eval-source-map',
  entry:  [
    'webpack-hot-middleware/client?reload=true',
    __dirname + '/src/app/main.js'
  ],
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015','react']
        }
      },
      {
        test: /\.scss$/,
        loader: 'style!css?modules!sass'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/src/app/index.tmpl.html'
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}
