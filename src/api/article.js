// 文章相关请求模块

import request from '@/utils/request.js'


// Body 参数使用data 设置

// Query 参数使用 params 设置

// Headers 参数使用 headers 设置

// 路径id :xxx 格式 用es6  拼接url 后面


// 获取文章列表（适用内容管理、评论管理、图文数据）
export const getArticles = (params) => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/articles',
        params
    })
}


// 获取文章频道
export const getArticlesChannels = () => {
    return request({
        method: 'GET',
        url: '/mp/v1_0/channels'
    })
}


// 删除文章   路径id
export const deleteArticle = (articleId) => {
    return request({
        method: 'DELETE',
        url: `/mp/v1_0/articles/${articleId}`
    })
}



// 发表文章（新建）
export const addArticle = (data, draft = false) => {
    return request({
        method: 'POST',
        url: '/mp/v1_0/articles',
        data: data,
        params: {
            // 是否存为草稿（true 为草稿） 可以设置默认值  注 放后面
            draft: draft
        }
    })
}


// 获取指定文章
export const getArticle = (articleId) => {
    return request({
        method: 'GET',
        url: `/mp/v1_0/articles/${articleId}`
    })
}


// 修改文章
export const updateArticle = (articleId, data, draft = false) => {
    return request({
        method: 'PUT',
        url: `/mp/v1_0/articles/${articleId}`,
        params: {
            draft
        },
        data
    })
}