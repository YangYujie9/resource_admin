import Vue from 'vue'
import VueRouter from 'vue-router'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component:  ()=>import('@/views/login'),

  },
    {
    path: '/administrator',
    name: 'administrator',
    component: ()=>import('@/views/index'),
    children:[{
        path: 'rolemanagement',
        name: 'rolemanagement',
        component: ()=>import('@/views/basic_management/rolemanagement'),
      },
      {
        path: 'organizational',
        name: 'organizational',
        component: ()=>import('@/views/basic_management/organizational'),
      },
      {
        path: 'subjectManagement',
        name: 'subjectManagement',
        component: ()=>import('@/views/basic_management/subject_management'),
      },
      {
        path: 'classManagement',
        name: 'classManagement',
        component: ()=>import('@/views/basic_management/class_management'),
      },
      {
        path: 'userManagement',
        name: 'userManagement',
        component: ()=>import('@/views/basic_management/user_management'),
      },
      {
        path: 'versionManagement',
        name: 'versionManagement',
        component: ()=>import('@/views/basic_management/version_management'),
      },
      {
        path: 'textbookManagement',
        name: 'textbookManagement',
        component: ()=>import('@/views/basic_management/textbook_management'),
      },
      {
        path: 'siteManagement',
        name: 'siteManagement',
        component: ()=>import('@/views/basic_management/site_management'),
      },
      {
        path: 'knowledgePoint',
        name: 'knowledgePoint',
        component: ()=>import('@/views/basic_management/knowledge_management'),
      },
      {
        path: 'chapterKnow',
        name: 'chapterKnow',
        component: ()=>import('@/views/basic_management/chapter_know'),
      },
      {
        path: 'passwordReview',
        name: 'passwordReview',
        component: ()=>import('@/views/audit_management/password_review'),
      },
      {
        path: 'systemConfig',
        name: 'systemConfig',
        component: ()=>import('@/views/audit_management/system_config'),
      },
      {
        path: 'questionType',
        name: 'questionType',
        component: ()=>import('@/views/audit_management/question_type'),
      },
      {
        path: 'resourceType',
        name: 'resourceType',
        component: ()=>import('@/views/audit_management/resource_type'),
      },
      {
        path: 'thirdPartyServer',
        name: 'thirdPartyServer',
        component: ()=>import('@/views/audit_management/thirdparty_server'),
      },
      {
        path: 'systemLog',
        name: 'systemLog',
        component: ()=>import('@/views/audit_management/system_log'),
      },
      {
        path: 'resourceManagement',
        name: 'resourceManagement',
        component: ()=>import('@/views/audit_management/resource_management'),
      },
      {
        path: 'questionManagement',
        name: 'questionManagement',
        component: ()=>import('@/views/audit_management/question_management'),
      }

    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
