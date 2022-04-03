import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import guest from './middleware/guest'
import auth from './middleware/auth'
import middlewarePipeline from './middlewarePipeline'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/components/GeneralLayout.vue'),
    children: [
      {
        path: '/',
        name: 'login',
        meta: { middleware: [ guest ] },
        component: () => import('@/views/auths/Login.vue')
      },
      {
        path: '/password/firstTime',
        name: 'password.firstTime',
        meta: { middleware: [ guest ] },
        component: () => import('@/views/auths/FirstTimeLogin.vue'),
      },
      {
        path: '/password/forgot',
        name: 'password.forgot',
        meta: { middleware: [ guest ] },
        component: () => import('@/views/auths/ForgotPassword.vue'),
      },
      {
        path: '/password/reset/:token',
        name: 'password.reset',
        meta: { middleware: [ guest ] },
        component: () => import('@/views/auths/ResetPassword.vue'),
      },
    ]
  },
  {
    path: '/',
    component: () => import('@/components/AppLayout.vue'),
    children: [
      // Dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: { middleware: [ auth ] },
        component: () => import('@/views/Dashboard.vue')
      },

      // Profile Management
      {
        path: 'profile',
        name: 'profile.detail',
        meta: { middleware: [ auth ] },
        component: () => import('@/views/profile/UserProfile.vue')
      },
      {
        path: 'profile/changePassword',
        name: 'profile.changePword',
        meta: { middleware: [ auth ] },
        component: () => import('@/views/profile/ChangePassword.vue')
      },

      // User Management
      {
        path: 'users',
        name: 'users',
        meta: { middleware: [ auth ], permissions: ['users.*', 'users.list', 'users.add', 'users.view', 'users.update', 'users.delete'] },
        component: () => import('@/views/Users.vue'),
      },

      // Audit Log
      {
        path: 'auditLogs',
        name: 'auditLogs',
        meta: { middleware: [ auth ], permissions: ['auditLogs.*', 'auditLogs.list'] },
        component: () => import('@/views/AuditLogs.vue'),
      },

      // Logout
      {
        path: 'logout',
        name: 'logout',
        // meta: { middleware: [ auth ] },
        component: () => import('@/views/auths/Logout.vue')
      }
    ]
  },

  // Error Pages
  { path: '/403', name: 'error.403', component: () => import('@/components/Err403Page.vue') },
  { path: '/500', name: 'error.500', component: () => import('@/components/Err500Page.vue') },

  // If route not found (404)
  { path: '*', component: () => import('@/components/Err404Page.vue') },
]

const router = new VueRouter({
  base: process.env.VUE_APP_BASE_URL,
  routes,
  scrollBehavior() {
    return {x: 0, y: 0};
  }
})

router.beforeEach(async (to, from, next) => {
  if (!(to.meta.middleware || to.meta.permissions)) {
    process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] No middleware and permission meta tag defined')
    return await next()
  } else {
    process.env.NODE_ENV === 'production' ? null : console.log('[DEBUG] Middleware or permission meta tag exists')
  }

  const middleware = to.meta.middleware
  const permissions = to.meta.permissions

  const context = {
    to,
    from,
    next,
    store,
    permissions
  }

  return await middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})

export default router
