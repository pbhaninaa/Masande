module.exports = {
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/clients': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
}
