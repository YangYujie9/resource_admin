const ua = window.navigator.userAgent.toLocaleLowerCase();// 当前浏览器
const href = location.href; // 当前资源页面地址
const host = location.host;
const IE = !!window.ActiveXObject || "ActiveXObject" in window || /edge/.test(window.navigator.userAgent.toLocaleLowerCase());
const Chrome = /chrome/.test(ua);
const Firefox = /firefox/.test(ua);
const Safari = /safari/.test(ua) && !/chrome/.test(ua);
const isDev = process.env.NODE_ENV == 'development';
const isTest = "";
const isProd = process.env.NODE_ENV == 'production';
const delay = 200;
// const defaultReqTimeout = 30000;
const defaultReqTimeout = 20 * 60 * 1000;


export default {
  IE,
  Chrome,
  Firefox,
  Safari,
  isDev,
  isTest,
  isProd,
  delay,
  defaultReqTimeout
}
