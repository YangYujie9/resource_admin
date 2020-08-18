//彭。http://192.168.2.63:8888
//高。http://192.168.2.21:8888


import resourceConfig from './resourceConfig';

let hostUrl = "";
let cdnUrl = "";

if(resourceConfig.isDev) {
  hostUrl = "http://192.168.2.21:8888";
} else if(resourceConfig.isTest) {
  hostUrl = "172.16.40.55:8888";
} else if(resourceConfig.isProd) {
  hostUrl = location.origin;
}

export {
  hostUrl,
  cdnUrl
}
