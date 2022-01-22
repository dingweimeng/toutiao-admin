// 先 npm i axios 
import axios from 'axios'
// 解决后端返回大数字问题
import JSONbig from 'json-bigint'


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


export default request