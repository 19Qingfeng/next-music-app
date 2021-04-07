module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局注入 相当于sass-resource-loader
        prependData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  }
}
