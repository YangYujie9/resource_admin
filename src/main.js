import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import erpAxios from './common/axios'
import plugins from './utils/globalComponents'   //全局组件
import './assets/css/reset.css'


Vue.use(plugins)


Vue.use(ElementUI)
import Cookies from 'js-cookie'



Vue.$http = Vue.prototype.$http = erpAxios


//路由拦截


router.beforeEach((to, from, next) => { 

    if( Cookies.get('resource-admin')) {
    	// console.log(store.state.person)

      if (store.state.person.userInfo.userId) {
      } else {

        store.dispatch('getUserBaseInfo',router)
      }

      if (to.path =='/login') {


        next({
          path: '/administrator/rolemanagement',
        })
      } else {

        next()
      }


    } else {

      if (to.path !='/login') {
        next({
          path: '/login',
        })
      } else {
        next()
      }

    }


    next()
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
