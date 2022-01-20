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
    },
    {
        path: '/',
        component: () =>
            import ('@/views/layout/index.vue'),
        children: [{
            path: '', // 默认为空 就是子路由 相当于 重定向
            name: 'home',
            component: () =>
                import ('@/views/home/index.vue')
        }]
    }
]

const router = new VueRouter({
    routes
})

export default router