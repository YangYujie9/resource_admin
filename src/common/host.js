// mock http://dev.jfedu.com:9001
// 开发环境 http://172.16.6.136:8888*
// 前端用户环境 http://172.16.6.33:8888
// 用户前端 http://172.16.6.33:8888
// 康例启 http://172.16.31.87:9999
// 李虹菲 http://172.16.8.216:9999
import resourceConfig from './resourceConfig';

let hostUrl = "";
let cdnUrl = "";

if(resourceConfig.isDev) {
  hostUrl = "http://192.168.2.63:8888";
} else if(resourceConfig.isTest) {
  hostUrl = "172.16.40.55:8888";
} else if(resourceConfig.isProd) {
  hostUrl = location.origin;
}

export {
  hostUrl,
  cdnUrl
}
