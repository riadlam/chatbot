import { createRouter, createWebHistory } from 'vue-router'
import AuthScreen from '../components/AuthScreen.vue'
import Dashboard from '../components/Dashboard.vue'
import PricingPlan from '../components/PricingPlan.vue'
import Setup from '../components/Setup.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthScreen
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },

  {
    path: '/pricing-plan',
    name: 'PricingPlan',
    component: PricingPlan
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingPlan
  },
  {
    path: '/setup',
    name: 'Setup',
    component: Setup,
    meta: { requiresAuth: true }
  },
  // Catch all route - redirect to auth
  {
    path: '/:pathMatch(.*)*',
    redirect: '/auth'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else if (to.name === 'Auth' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 