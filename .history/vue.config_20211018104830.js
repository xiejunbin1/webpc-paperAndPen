/*
 * @Author: yhy
 * @Date: 2021-01-26 14:02:34
 * @LastEditTime: 2021-02-03 17:18:21
 * @LastEditors: yhy
 * @Description:
 */
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // outputDir: ['D:\\gfy-qtpc-test2\\gfy-qtpc-publish2\\www','dist'],
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/assets/style/vars.less")]
    }
  },
  chainWebpack: config => {
    //关闭预加载
    config.plugins.delete("prefetch");

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"));
    // 这里只写了两个个，你可以自己再加，按这种格式.set('', resolve(''))
  },
  // 不生成 map文件加快打包速度
  productionSourceMap: false,
  // 路径 相对路径
  publicPath: "./",
  lintOnSave: false,
  // 配置 axios 代理请求
  devServer: {
    host: '0.0.0.0', //ip地址
    // host: '192.168.0.42', //ip地址
    hot: true, //热加载
    port: 4397, //端口
    https: false, //false关闭https，true为开启
    open: true, //自动打开浏览器
    proxy: {
      "/api": {
        target: "http://119.23.113.71:9001/service-soa",
        // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api/xxx即可
          "^/api": "/"
        }
      },
      "/qq": {
        target: "https://graph.qq.com/oauth2.0",
        // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        changeOrigin: true,
        ws: true,
        
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api/xxx即可
          "^/qq": "/"
        }
      },
      "/oss": {
        target: "http://pubquanlang.oss-cn-shenzhen.aliyuncs.com",
        // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api/xxx即可
          "^/oss": "/"
        }
      },
      '/socket.io': {
        target: 'http://192.168.0.129:7681', //代理的服务地址
        ws: true,
        changeOrigin: true, // needed for virtual hosted sites
        logLevel: 'debug'
      }
    }
  }
};
