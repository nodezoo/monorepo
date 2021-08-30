module.exports = {
  pages: {
    index: 'src/index.js',
    account: 'src/account.js',
  },
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        'vue$': __dirname+'/node_modules/vue/dist/vue.esm.js',
        '^vuetify': __dirname+'/node_modules/vuetify',
      }
    }
  }
}
