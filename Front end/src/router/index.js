import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'PlatformDashboard',
    component: () => import('../views/PlatformDashboard.vue'),
    meta: { requiresAuth: true, roles: ['PLATFORM_ADMIN'] }
  },
  {
    path: '/tenant-dashboard',
    name: 'TenantDashboard',
    component: () => import('../views/TenantDashboard.vue'),
    meta: { requiresAuth: true, roles: ['TENANT_ADMIN', 'TENANT_MANAGER'] }
  },
  {
    path: '/tenants',
    name: 'Tenants',
    component: () => import('../views/Tenants.vue'),
    meta: { requiresAuth: true, roles: ['PLATFORM_ADMIN'] }
  },
  {
    path: '/trips',
    name: 'Trips',
    component: () => import('../views/Trips.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../views/Clients.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Helper function to check if user has required role
function hasRequiredRole(userRoles, requiredRoles) {
  if (!requiredRoles || requiredRoles.length === 0) return true
  if (!userRoles || userRoles.length === 0) return false
  return requiredRoles.some(role => userRoles.includes(role))
}

// Helper function to get default route based on user role
function getDefaultRoute(userRoles) {
  if (!userRoles || userRoles.length === 0) return '/trips'

  // Roles are already strings from the backend
  if (userRoles.includes('PLATFORM_ADMIN')) {
    return '/dashboard'
  } else if (userRoles.includes('TENANT_ADMIN') || userRoles.includes('TENANT_MANAGER')) {
    return '/tenant-dashboard'
  } else {
    return '/trips'
  }
}

// Navigation guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const user = store.getters['auth/user']
  const userRoles = user?.roles || []

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
    } else {
      // Check role-based access
      const requiredRoles = to.meta.roles
      if (requiredRoles && !hasRequiredRole(userRoles, requiredRoles)) {
        // User doesn't have required role, redirect to their default route
        next(getDefaultRoute(user?.roles))
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next(getDefaultRoute(user?.roles))
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
