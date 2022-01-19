import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
    // 登录页面
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login/index.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router