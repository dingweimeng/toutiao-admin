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
        children: [
            // 默认为空 就是子路由 相当于 重定向
            {
                path: '',
                name: 'Home',
                component: () =>
                    import ('@/views/home/index.vue')
            },
            {
                path: '/article',
                nama: 'Article',
                component: () =>
                    import ('@/views/article/index.vue')
            },
            {
                path: '/publish',
                nama: 'pblish',
                component: () =>
                    import ('@/views/pblish/index.vue')
            },
            {
                path: '/image',
                nama: 'image',
                component: () =>
                    import ('@/views/image/index.vue')
            },
            {
                path: '/comment',
                nama: 'comment',
                component: () =>
                    import ('@/views/comment/index.vue')
            }
        ]
    }
]

const router = new VueRouter({
    routes
})


// 路由前置守卫
router.beforeEach((to, from, next) => {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (to.path !== '/login') {
        // 判断是否登录
        if (user) {
            next()
        } else {
            next('/login')
        }
    } else {
        // 是登录页面 放行
        next()
    }

})

export default router