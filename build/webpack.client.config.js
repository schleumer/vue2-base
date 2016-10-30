const webpack = require('webpack')
const base = require('./webpack.base.config')
const vueConfig = require('./vue-loader.config')

const config = Object.assign({}, base, {
  plugins: (base.plugins || []).concat([
    // strip comments in Vue code
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'client-vendor-bundle.js'
    })
  ])
})


if (process.env.NODE_ENV === 'production') {
  const ExtractTextPlugin = require('extract-text-webpack-plugin')

  let extractCSS = new ExtractTextPlugin('styles.css');

  config.module.rules.push({
    test: /\.scss$/,
    loader: extractCSS.extract({
      loader: [ "css?-url&-import&sourceMap", "sass?precision=10&sourceMap" ],
      fallbackLoader: "style"
    }),
    exclude: /node_modules/
  })

  config.plugins.push(
    extractCSS,
    // this is needed in webpack 2 for minifying CSS
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
} else {
  config.module.rules.push({
    test: /\.scss$/,
    loaders: [ "style", "css?-url&-import&sourceMap", "sass?precision=10&sourceMap" ],
    exclude: /node_modules/
  })
}

module.exports = config
