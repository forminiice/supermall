import axios from 'axios'

export function request(config) {
  // 1. 创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })
  // 2. axios的拦截器
  // 拦截请求
  instance.interceptors.request.use(config => {
    // 请求成功
    return config;
  }, err => {
    // 请求失败
    console.log(err);
  })
  // axios.interceptors.response;  // 拦截响应
  instance.interceptors.response.use(result => {
    // 请求成功
    return result.data;
  }, err => {
    // 请求失败
    console.log(err);
  })
  // 3. 发送真正的网络请求
  return instance(config);
}
