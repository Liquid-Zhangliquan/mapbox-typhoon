module.exports = {
  publicPath: './',
  devServer: {
    open: true,
  },
  lintOnSave: false,
  productionSourceMap: true,
  chainWebpack: config => {
    config.performance.set('hints', false);
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(frag|vert|glsl)$/i,
          use: 'raw-loader',
        },
      ],
    },
  },
}
