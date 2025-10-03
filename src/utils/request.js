import axios from 'axios'

//创建axios实例对象
const request = axios.create({
  baseURL: 'https://m1.apifoxmock.com/m1/7116608-6839408-6228127',
  timeout: 600000,
  params: {
    apifoxApiId: '357935821'
  }
})

//axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    return Promise.reject(error)
  }
)

export default request