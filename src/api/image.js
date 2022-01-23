// 素材请求相关模块
import request from '@/utils/request.js'

// Body 参数使用data 设置

// Query 参数使用 params 设置

// Headers 参数使用 headers 设置

// 路径id :xxx 格式 用es6  拼接url 后面




// 上传用户图片素材
export const uploadImage = (data) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/user/images',
        // 一般文件上传的接口都要求把请求头的Content-Tpye 
        // 设置为Content-Type	multipart/form-data
        // 但是用axios上传的话不需要手动设置，只要给data 一个 FormData对象即可
        data
    })
}


// 获取用户图片素材
export const getImages = (params) => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/user/images',
        params
    })
}