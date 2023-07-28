import path from 'path-browserify'
// import fs from 'fs'
import { defineConfig, loadEnv } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { createHtmlPlugin } from 'vite-plugin-html'
import styleImport from 'vite-plugin-style-import'
// import replace from '@rollup/plugin-replace'
import eslintPlugin from 'vite-plugin-eslint'
// 雪碧图插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    define: {
      'process.env': { ...env }
    },
    plugins: [
      createVuePlugin({
        jsx: true
      }),
      eslintPlugin(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: 'vue Element Admin',
            cdn: {
              css: [],
              js: [
                // '//cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js',
                // '//cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js',
                // '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
                // '//cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js',
              ]
            }
          }
        }
      }),
      styleImport({
        libs: [
          {
            libraryName: 'element-ui',
            // styleLibraryName: 'theme-chalk',
            esModule: true,
            resolveStyle: (name) => {
              return `theme-chalk/${name}.css`
            }
          }
        ]
      }),
      // 雪碧图
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(__dirname, './src/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',

        /**
         * 自定义插入位置
         * @default: body-last
         */
        inject: 'body-last' | 'body-first',

        /**
         * custom dom id
         * @default: __svg__icons__dom__
         */
        customDomId: '__svg__icons__dom__'
      })
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: [
        {
          find: /@\/.+/,
          replacement: (val) => {
            return val.replace(/^@/, path.resolve(__dirname, '/src/'))
          }
        },
        {
          // this is required for the SCSS modules
          find: /^~(.*)$/,
          replacement: '$1'
        }
        // {
        //  find: '@',
        //  replacement: path.resolve(__dirname, 'src'),
        // },
        // {
        //   'venn.js': 'venn.js/build/venn.js',
        // },
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // additionalData: `@import "./node_modules/ant-design-vue/lib/style/index.less";
          //     @import "./node_modules/ant-design-vue/es/style/themes/default.less";`,
          // additionalData: `@import "${path.resolve(__dirname, 'src/assets/style/global.less')}";`,
          modifyVars: {}
        }
        // scss: {
        //   additionalData: `@import "${path.resolve(__dirname, 'src/styles/element-variables.scss')}";
        //                   @import "${path.resolve(__dirname, 'src/styles/index.scss')}";`
        // }
      }
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
      commonjsOptions: {
        //  改为 ture 后就会转化 require 语法
        transformMixedEsModules: true
      }
      // rollupOptions: {
      //   // 确保外部化处理那些你不想打包进库的依赖
      //   external: ['vue', 'vue-router', 'vuex', 'axios', 'xlsx'],
      //   output: {
      //     // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      //     globals: {
      //       vue: 'Vue',
      //       'vue-router': 'VueRouter',
      //       vuex: 'Vuex',
      //       axios: 'axios',
      //       xlsx: 'XLSX'
      //     }
      //   }
      // }
    },
    server: {
      port: 9527
      // proxy: {
      //  '/api': {
      //    target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
      //    changeOrigin: true,
      //    ws: false,
      //    rewrite: (path) => path.replace(/^\/api/, ''),
      //  }
      // },
    }
  })
}
