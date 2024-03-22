import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false
import {
    get,
    post,
    msg
} from '@/utils/axios.js'
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$msg = new msg()
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')