import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import loadingDirective from './components/base/loading/directive'
import emptyDirective from './components/base/empty/directive'
import lazyPlugin from 'vue3-lazy'

import '@/assets/scss/index.scss'

createApp(App)
  .use(store)
  .use(router)
  .directive('loading', loadingDirective)
  .directive('empty', emptyDirective)
  .use(lazyPlugin, {
    loading: require('./assets/image/loading.png'),
    error: require('./assets/image/loading.png')
  })
  .mount('#app')
