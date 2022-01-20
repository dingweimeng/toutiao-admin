// 先 npm i axios 
import axios from 'axios'


const request = axios.create({
    //   基础路径
    baseURL: 'http://api-toutiao-web.itheima.net'
})



//  请求拦截器



// 相应拦截器


export default request