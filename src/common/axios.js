import axios from 'axios';
import resourceConfig from './resourceConfig';
import { hostUrl } from './host';
import store from '../store'
// import iView from 'iview';
import { Message } from 'element-ui';
import Cookies from 'js-cookie'

// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`
export const axiosService = axios.create({
  baseURL: hostUrl, // api 的 base_url
  timeout: resourceConfig.defaultReqTimeout, // 请求超时时间
  headers: {
    // delete: {'Content-Type': 'application/json;charset=UTF-8'},
    // post: {'Content-Type': 'application/json;charset=UTF-8'},
    // put: {'Content-Type': 'application/json;charset=UTF-8'}
  },
  httpConfig: {},//自定义配置
  validateStatus:function(status){
    return status < 500
  }
})

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
//axios.defaults.timeout = 30000;
// request拦截器
axiosService.interceptors.request.use(
  config => {
    // 超时
    if(config.httpConfig.timeout) {
      config.timeout = config.httpConfig.timeout;
    }
    //顶部 LoadingBar
    config.httpConfig.loading //&& iView.LoadingBar.start();

    //body加参数
    if(!config.data) {
      config.data = config.httpConfig.bodyData;
    }
    //query加参数
    if(!config.params) {
      config.params = config.httpConfig.queryData;
    }

    //设置 token
    if (Cookies.get('resource-admin')) {
      config.headers['Authorization'] = Cookies.get('resource-admin');
    }
    return config
  },
  error => {
    // Do something with request error
    console.error(error) // for debug
    Promise.reject(error)
  }
)

/**
 * 返回拦截
 * @param {Object} response.config.httpConfig.loading 是否顶部loading
 * @param {Object} response.config.httpConfig.clsoeMessage 是否关闭message提醒
 */
axiosService.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      response.config.httpConfig.loading //&& iView.LoadingBar.error();
      !response.config.httpConfig.clsoeMessage && Message.error('网络异常');
      return Promise.reject(response.data);
    } else {
      if(response.data.status !== "200") {
        response.config.httpConfig.loading //&& iView.LoadingBar.error();
        !response.config.httpConfig.clsoeMessage && response.data && Message.error(response.data.data.msg || '网络异常');
        if(response.data.status === "401") {
          // 清空失效 token，防止无效 token 重复请求
          Cookies.remove('resource-admin');
          localStorage.removeItem('Author-Info');
          setTimeout(function(){
            window.location.href = "/login";
          }, 3000)
        }
        return Promise.reject(response.data);
      } else {
        response.config.httpConfig.loading //&& iView.LoadingBar.finish();
        return response.data;
      }
    }
  },
  error => {
    error.config.httpConfig.loading //&& iView.LoadingBar.error();
    !error.config.httpConfig.clsoeMessage && Message.error(error.code === 'ECONNABORTED' ? '请求超时' : '网络异常' );
    return Promise.reject(error)
  }
)

export default {
  /**
   * 封装get方法的传参方式
   * @param { !String } url
   * @param { ?Object } _queryParams query参数
   * @param { ?Object } _bodyParams body参数
   * @param { ?Object } httpConfig 自定义其他配置
   */
  // get: function (url, _queryParams, _bodyParams, httpConfig = {}) {
  //   return axiosService.get(url, { params: _queryParams, httpConfig: httpConfig})
  // },
  get: function (url, _queryParams, _bodyParams, httpConfig = {}) {
    return axiosService.get(url, { params: _queryParams, httpConfig: httpConfig})
  },
  /**
   * delete
   */
  delete: function (url, _queryParams, _bodyParams, httpConfig = {}) {
    return axiosService.delete(url, { params: _queryParams, httpConfig: Object.assign({}, httpConfig, {bodyData: _bodyParams}) })
  },

  /**
   * post
   */
  post: function (url, _bodyParams, _queryParams, httpConfig = {}) {
    return axiosService.post(url, _bodyParams, { httpConfig: Object.assign({}, httpConfig, {queryData: _queryParams}) })
  },

  /**
   * put
   */
  put: function (url, _bodyParams, _queryParams, httpConfig = {}) {
    return axiosService.put(url, _bodyParams, { httpConfig: Object.assign({}, httpConfig, {queryData: _queryParams}) })
  },

  /**
   * 下载
   */
  download:function(url, _queryParams={}){
    //let tempwindow = window.open('_blank');
    let queryString = Object.entries(_queryParams).map(function(item){
      return item[0] + "=" + item[1]
    }).join('&')
    // 新建页面打开
    //tempwindow.location = `${hostUrl}/${url}?${queryString}`;

    // 本页面打开
    console.log(`${hostUrl},${url}`)
    // return
    location.href = `${hostUrl}${url}?${queryString}&Authorization=${Cookies.get('resource-admin')}`;
  }
}
