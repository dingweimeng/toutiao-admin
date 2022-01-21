// // 登录相关请求模块
import request from '@/utils/request.js'
// Body 参数使用data 设置
// Query 参数使用 params 设置
// Headers 参数使用 headers 设置

// 登录
export const Login = (data) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        data
    })
}


// 获取用户信息
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/user/profile',
    })
}