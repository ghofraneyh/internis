<template>
  <div class="dashboard-bg min-h-screen bg-gray-50 flex items-center justify-center py-16">
    <div class="dashboard-card max-w-6xl w-full mx-auto rounded-2xl shadow-lg bg-white flex">
      <!-- Sidebar verticale moderne -->
      <aside class="sidebar flex flex-col items-center gap-10 py-14 px-8 w-80 min-h-[500px] bg-gradient-to-b from-primary to-blue-400 text-white shadow-xl overflow-y-auto rounded-l-2xl">
        <!-- Avatar et nom utilisateur -->
        <div v-if="user" class="flex flex-col items-center gap-4 w-full h-full">
          <div class="flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 border-4 border-white shadow-lg text-2xl font-semibold uppercase mb-1 tracking-wide">
            {{ getInitial(user.email ?? '') }}
          </div>
          <div class="text-xl font-semibold tracking-wide text-white drop-shadow text-center">{{ getNameFromEmail(user.email ?? '') }}</div>
          <div class="text-xs font-medium mb-2 tracking-wider uppercase" style="color: #f3f4f6;">Compte utilisateur</div>
          <!-- Bloc Statistiques modernisé -->
          <div class="flex flex-col gap-2 w-full items-center mt-2">
            <v-chip color="success" size="x-small" class="font-medium tracking-wide bg-opacity-80 text-xs px-3 py-1">Connecté</v-chip>
            <div class="flex items-center gap-1 mt-1">
              <v-icon size="16" color="#fff">mdi-clock-outline</v-icon>
              <span class="text-[12px] font-light" style="color: #f3f4f6;">Depuis&nbsp;: {{ formatDate(new Date()) }}</span>
            </div>
          </div>
          <div class="flex-1"></div>
          <!-- Bloc Statistiques d'activité tout en bas -->
          <div class="w-full mb-2 flex justify-center">
            <div class="bg-gray-50 rounded-2xl shadow p-6 flex flex-col items-center min-w-[280px] max-w-md w-full">
              <div class="flex items-center gap-2 mb-4">
                <div class="bg-primary/20 rounded-full p-2 flex items-center justify-center">
                  <v-icon color="primary">mdi-chart-line</v-icon>
                </div>
                <span class="text-xs font-semibold text-gray-900 text-center">Statistiques d'activité</span>
              </div>
              <div class="w-full space-y-2 text-center">
                <div>
                  <span class="text-xs font-medium text-gray-800">Sessions</span><br>
                  <span class="text-xs font-semibold text-gray-900">12</span>
                </div>
                <div>
                  <span class="text-xs font-medium text-gray-800">Temps total</span><br>
                  <span class="text-xs font-semibold text-gray-900">2h 45m</span>
                </div>
                <div>
                  <span class="text-xs font-medium text-gray-800">Actions</span><br>
                  <span class="text-xs font-semibold text-gray-900">47</span>
                </div>
              </div>
              <div class="flex justify-center mt-4">
                <v-chip color="success" size="x-small" class="font-medium">Actif</v-chip>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <!-- Contenu principal -->
      <main class="flex-1 flex flex-col py-16 px-16">
        <div class="flex justify-end mb-4">
          <v-btn @click="handleSignOut" color="error" variant="outlined" prepend-icon="mdi-logout">
            Se déconnecter
          </v-btn>
        </div>
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-800 tracking-wide">Tableau de bord</h1>
        </div>
        <div class="bg-gray-50 rounded-2xl shadow p-6 mb-8">
          <p class="text-base text-gray-700 mb-2">Bienvenue sur votre tableau de bord !</p>
          <div v-if="user" class="mt-2">
            <v-chip color="primary" class="mb-2">
              <v-icon start>mdi-account</v-icon>
              {{ user.email }}
            </v-chip>
            <p class="text-caption text-gray-500">
              Connecté depuis le {{ formatDate(user.created_at) }}
            </p>
          </div>
        </div>
        <v-card flat class="mb-6">
          <v-card-title>
            <v-icon start>mdi-cog</v-icon>
            Actions rapides
          </v-card-title>
          <v-card-text>
            <v-btn block color="primary" class="mb-2" prepend-icon="mdi-account-edit">
              Modifier le profil
            </v-btn>
            <v-btn block color="secondary" class="mb-2" prepend-icon="mdi-lock-reset">
              Changer le mot de passe
            </v-btn>
            <v-btn block color="info" prepend-icon="mdi-help-circle">
              Aide
            </v-btn>
          </v-card-text>
        </v-card>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, signOut } = useAuth()
const router = useRouter()

const handleSignOut = async () => {
  const result = await signOut()
  if (result.success) {
    router.push('/login')
  }
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Extraire le nom à partir de l'email (avant le @, première lettre en majuscule)
const getNameFromEmail = (email: string) => {
  if (!email) return ''
  const name = email.split('@')[0]
  return name.charAt(0).toUpperCase() + name.slice(1)
}
// Récupérer l'initiale pour l'avatar
const getInitial = (email: string) => {
  if (!email) return ''
  return email.charAt(0).toUpperCase()
}
</script>

<style scoped>
.dashboard-bg {
  min-height: 100vh;
  width: 100vw;
  background: #f5f6fa;
}
.dashboard-card {
  min-height: 500px;
}
.sidebar {
  min-height: 500px;
  box-shadow: 0 4px 32px 0 rgba(0,0,0,0.08);
}
</style> 