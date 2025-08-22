<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <!-- Sidebar -->
      <div class="w-80 bg-blue-600 min-h-screen shadow-lg">
        <!-- Profil utilisateur -->
        <div class="p-6 text-center text-white">
          <div class="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <span class="text-2xl font-bold text-blue-600">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</span>
          </div>
          <h2 class="text-xl font-semibold mb-1">{{ user?.email?.split('@')[0] || 'Utilisateur' }}</h2>
          <p class="text-sm mb-2">COMPTE ADMINISTRATEUR</p>
          <div class="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-xs">
            <div class="w-2 h-2 bg-white rounded-full mr-2"></div>
            Connecté
          </div>
          <p class="text-xs mt-3">
            Depuis le {{ formatDate(new Date()) }}
          </p>
        </div>

        <!-- Menu de navigation -->
        <div class="px-4 pb-6">
          <h3 class="text-white font-semibold mb-3 px-2">Menu</h3>
          <nav class="space-y-2">
            <router-link 
              to="/dashboard" 
              class="flex items-center px-4 py-3 text-white rounded-lg transition-all duration-200 hover:bg-blue-700"
              :class="{ 'bg-blue-700': $route.name === 'Dashboard' }"
            >
              <i class="fas fa-tachometer-alt mr-3"></i>
              Tableau de bord
            </router-link>
            <router-link 
              to="/missions" 
              class="flex items-center px-4 py-3 text-white rounded-lg transition-all duration-200 hover:bg-blue-700"
              :class="{ 'bg-blue-700': $route.name === 'Missions' }"
            >
              <i class="fas fa-project-diagram mr-3"></i>
              Missions
            </router-link>
          </nav>
        </div>

        <!-- Statistiques d'activité -->
        <div class="px-6 pb-6">
          <div class="bg-blue-500 rounded-xl p-4">
            <div class="flex items-center mb-3">
              <i class="fas fa-chart-line text-white mr-2"></i>
              <span class="text-white font-semibold">Statistiques d'activité</span>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-blue-100 text-sm">Sessions</span>
                <span class="text-white font-semibold">12</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-100 text-sm">Temps total</span>
                <span class="text-white font-semibold">2h 45m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-100 text-sm">Actions</span>
                <span class="text-white font-semibold">47</span>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-blue-400">
              <div class="inline-flex items-center px-2 py-1 rounded-full bg-green-500 text-xs text-white">
                Actif
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="flex-1 p-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">   Tableau de bord</h1>
            <p class="text-gray-600">   Bienvenue sur votre tableau de bord !</p>
            <p class="text-sm text-gray-500 flex items-center mt-2">
              <i class="fas fa-user-circle mr-2"></i>
              {{ user?.email }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              Connecté depuis le {{ formatDate(new Date()) }}
            </p>
          </div>
          <button 
            @click="logout" 
            class="bg-red-500 hover:bg-red-600 text-red-500 px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>
            SE DÉCONNECTER
          </button>
        </div>

        <!-- Actions rapides -->
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <i class="fas fa-cog mr-3 text-xl"></i>
            <h2 class="text-xl font-semibold text-gray-800">Actions rapides</h2>
          </div>
          
          <div class="grid gap-4">
            
            
            <button class="bg-teal-500 hover:bg-teal-600 text-black p-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg">
              <i class="fas fa-key mr-3 text-xl"></i>
              <span class="font-semibold">CHANGER LE MOT DE PASSE</span>
            </button>
            
            <button class="bg-blue-400 hover:bg-blue-500 text-black p-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg">
              <i class="fas fa-question-circle mr-3 text-xl"></i>
              <span class="font-semibold">AIDE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { user, signOut } = useAuth()

const logout = async () => {
  await signOut()
  router.push('/login')
}

const formatDate = (date) => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Vous pouvez ajouter ici d'autres initialisations si nécessaire
})
</script>

<style scoped>
.router-link-active {
  background-color: rgba(29, 78, 216, 1); /* bg-blue-700 */
}
</style>
