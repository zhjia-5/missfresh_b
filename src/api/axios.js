import axios from 'axios';
import { alertMessage } from '@/utils';

//创建一个带有拦截器功能的axios实例,配置基本路径。
const ins = axios.create({baseURL:'https://mallapi.duyiedu.com/'});
// 拦截请求数据
ins.interceptors.request.use((config) => {
  if (config.url.includes('/passport')) {
    return config;
  }else{
    return {
      ...config,
      params: {
        ...config.params,
        appkey: JSON.parse(localStorage.getItem('appkey'))//本地中获取appkey
      },
    };
  }
}, (error) => Promise.reject(error));


// 拦截响应数据（response），每次发送请求的时候都会先运行use
ins.interceptors.response.use((resp)=>{
  if(resp.data.status === 'fail'){
    alertMessage({
      content:resp.data.msg,
      type:"fail",
      duration:2000,
    });
  }
  return resp;
});
export default ins;









