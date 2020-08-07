/*用户信息 企业信息*/
import Vue from 'vue'
import Cookies from 'js-cookie'

const state = {
  //用户信息
  userInfo: {},

  pageDict: [],
  staffVO: {
    Authorization: ''
  },
  isCollapse:false,
  iconUrl: 'data:image/png;base64,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'
}

const getters = {

  getuserInfo: state => {
    return state.userInfo
  },
  getstaffVO: state => {
    
    return state.staffVO
  },
  getpageDict: state => {
    
    return state.pageDict
  },
  geticonUrl: state => {
    
    return state.iconUrl
  },
  isCollapse: state => {
    
    return state.isCollapse
  },



  
}

const mutations = {
  setUserInfo(state, data) {
    
    state.userInfo = data
  },
  setstaffVO(state, data) {

    state.staffVO = data
    
  },

  setpageDict(state, data) {

    state.pageDict = data
    
  },


  setisCollapse(state) {
    state.isCollapse = !state.isCollapse
  },


}


//console.info(fStartWebsocket)
const actions = {

  getUserBaseInfo(context,router) {//注意参数的传递

    Vue.$http.get(`/api/open/systemUser/info`)
    .then((data) => {

        if (data.status == "200") {

          context.commit('setUserInfo', data.data)

          context.commit('setstaffVO', {Authorization: Cookies.get('resource-admin')})
        }
      
    })



  }

}

export default {
  state,
  getters,
  mutations,
  actions
}
