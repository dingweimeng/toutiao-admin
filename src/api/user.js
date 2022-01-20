// // 登录相关请求模块
import request from '@/utils/request.js'

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
        headers: {
            Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NzQxNDc0MDYsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.fKrDkZl72LoJ1p27wIb79RobIUqgkxwQQUumU8lK_mY'
        }
    })
}