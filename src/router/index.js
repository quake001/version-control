import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },
  {
    path: '/logs',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Logs',
    meth: { title: '日志', icon: 'el-icon-setting' },
    children: [{
      path: 'monitor',
      name: 'Monitor',
      component: () => import('@/views/Log/index'),
      meta: { title: '操作日志', icon: 'el-icon-s-comment' }
    }]
  },
  {
    path: '/version',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Version',
    meta: { title: '版本管理', icon: 'el-icon-s-help' },
    alwaysShow: true,
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '版本目录' }
      },
      {
        path: 'addProject',
        name: 'AddPersion',
        component: () => import('@/views/addProject/index'),
        meta: { title: '新增项目' }
      },
      {
        path: 'detail/:projectId',
        name: 'Detail',
        hidden: true,
        component: () => import('@/views/table/detail'),
        meta: { title: '项目详情' }
      },
      {
        path: 'grayMonitor',
        name: 'GrayMonitor',
        hidden: true,
        component: () => import('@/views/grayMonitor/index'),
        meta: { title: '灰度监控' }
      },
      {
        path: 'addVersion/:projectId',
        nameL: 'AddVersion',
        component: () => import('@/views/addVersion/index'),
        hidden: true,
        meta: { title: '新增版本' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Setting',
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [
      {
        path: 'settingSystem',
        name: 'SettingSystem',
        component: () => import('@/views/settingSystem/index'),
        meta: { title: '系统设置', icon: '' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
