
module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: config => {
    // Use query string as hash to defeat caches instead of filename hash
    config.output.filename('static/[name].js?[contenthash:8]')
    config.output.chunkFilename('static/[name].js?[contenthash:8]')
    config
      .plugin('extract-css')
      .tap(args => {
        args[0].filename = 'static/[name].css?[contenthash:8]',
          args[0].chunkFilename = 'static/[name].css?[contenthash:8]'
        args[0].allChunks = true
        return args
      })

    // because we moved the hash to the end of the filename the default blacklist
    // no longer matches .map$ and includes map files on the index.html
    // so let's update the regex to match the new pattern
    config
      .plugin('preload')
      .tap(args => {
        args[0].fileBlacklist = [
          /\.map\?........$/,
          /hot-update\.js$/
        ]
        return args
      })
  }
  /*configureWebpack: {
    output: {
      filename: "static/app.js"
    }
  },
  css: {
    extract: {
      filename: "static/app.css"
    }
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
  }*/
}
