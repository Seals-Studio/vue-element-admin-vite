import Mock from 'mockjs'
import { param2Obj, isIE } from './utils'

import user from './user'
import role from './role'
import article from './article'
import search from './remote-search'

const mocks = [...user, ...role, ...article, ...search]

// for front mock
// please use it cautiously, it will redefine XMLHttpRequest,
// which will cause many of your third-party libraries to be invalidated(like progress event).
function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function (options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }

  // 判断环境不是 prod 或者 preview 是 true 时，加载 mock 服务
  if (import.meta.env.MODE !== 'production' || import.meta.env.VITE_APP_PREVIEW === 'true') {
    if (isIE()) {
      console.error('[vue-element-admin-vite] ERROR: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.')
    }
    // 使用同步加载依赖
    // 防止 vuex 中的 GetInfo 早于 mock 运行，导致无法 mock 请求返回结果
    console.log('[vue-element-admin-vite] mock mounting')

    Mock.setup({
      timeout: 800 // setter delay time
    })
    console.log('[vue-element-admin-vite] mock mounted')
  }
}

mockXHR()

export { mocks, mockXHR }
