// 文章相关请求模块

import request from '@/utils/request.js'
// Body 参数使用data 设置
// Query 参数使用 params 设置
// Headers 参数使用 headers 设置


// 获取文章列表（适用内容管理、评论管理、图文数据）
export const getArticles = (params) => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/articles',
        params
    })
}