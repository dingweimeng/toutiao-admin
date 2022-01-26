// 先 npm i axios 
import axios from 'axios'
// 解决后端返回大数字问题
import JSONbig from 'json-bigint'

// 引入router  
import router from '@/router/index.js'
// 非组件引入 element 单独提示
import { Message } from 'element-ui'


const request = axios.create({
    //   基础路径
    baseURL: 'http://api-toutiao-web.itheima.net',


    // 定义后端返回的原始数据处理 如(id大数字问题)  data 是后端原始数据
    transformResponse: [function(data) {
        //防止后端返回可能不是JSON格式字符串 就会报错 所有用 try  防止报错
        try {
            return JSONbig.parse(data)
        } catch (error) {
            return data
        }
    }]
})


//  请求拦截器
request.interceptors.request.use(function(config) {
    // 拿到tuken 对象
    const user = JSON.parse(window.localStorage.getItem('user'))
        // 如果有登录用户信息 则统一设置token
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
})


// 相应拦截器
request.interceptors.response.use(function(response) {
    // 所有响应码 2xx 的相应进入这个
    return response
}, function(error) {
    // 任何超出 2xx 的响应码都会进入这里
    if (error.response && error.response.status === 401) {
        //  跳转登录页面  引入 路由
        router.push('/login')
            // 清除本地存储的用户状态
        window.localStorage.removeItem('user')
        Message('登录状态无效，请重新登录')
    } else if (error.response.status === 403) {
        Message.error('没操作权限')
    } else if (error.response.status === 400) {
        Message('参数错误，请检查请求参数')
    } else if (error.response.status === 500) {
        Message.error('服务器内部异常，请稍后重试')
    }
    return Promise.reject(error)
})


export default request