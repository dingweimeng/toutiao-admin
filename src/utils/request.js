// 先 npm i axios 
import axios from 'axios'


const request = axios.create({
    //   基础路径
    baseURL: 'http://api-toutiao-web.itheima.net'
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


export default request