import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// element ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 全局css 样式
import '@/styles/index.css'


Vue.use(ElementUI);



Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')