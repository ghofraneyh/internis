import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    // Redirection par défaut
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

// Guard de navigation pour l'authentification
router.beforeEach(async (to, from, next) => {
  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    // Importer le composable d'authentification
    const { useAuth } = await import('../composables/useAuth')
    const { getCurrentUser } = useAuth()
    
    // Vérifier si l'utilisateur est connecté
    const user = await getCurrentUser()
    
    if (!user) {
      // Rediriger vers la page de connexion si non connecté
      next('/login')
      return
    }
  }
  
  // Si l'utilisateur est connecté et visite la page d'accueil, rediriger vers le dashboard
  if (to.path === '/' || to.path === '/home') {
    const { useAuth } = await import('../composables/useAuth')
    const { getCurrentUser } = useAuth()
    const user = await getCurrentUser()
    
    if (user) {
      next('/dashboard')
      return
    }
  }
  
  next()
})

export default router
