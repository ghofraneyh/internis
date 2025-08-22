<template>
    <div class="min-h-screen bg-gray-100">
      <div class="flex">
        <!-- Sidebar -->
        <div class="w-80 bg-blue-600 min-h-screen shadow-lg">
          <!-- Profil utilisateur -->
          <div class="p-6 text-center text-white">
            <div class="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl font-bold text-blue-600">{{ userInitial }}</span>
            </div>
            <h2 class="text-xl font-semibold mb-1">{{ userName }}</h2>
            <p class="text-sm mb-2">COMPTE ADMINISTRATEUR</p>
            <div class="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-xs">
              <div class="w-2 h-2 bg-white rounded-full mr-2"></div>
              Connecté
            </div>
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
        </div>
  
        <!-- Contenu principal -->
        <div class="flex-1 p-8">
          <!-- Header -->
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">Gestion des Missions</h1>
              <p class="text-gray-600">Gérez vos projets et missions</p>
            </div>
            <div class="flex space-x-4">
              <button 
                @click="openDialog()" 
                class="bg-blue-500 hover:bg-blue-600 text-black px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                <i class="fas fa-plus mr-2"></i>
                Nouveau Projet
              </button>
              <button 
                @click="logout" 
                class="bg-red-500 hover:bg-red-600 text-black px-6 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>
                SE DÉCONNECTER
              </button>
            </div>
          </div>
  
          <!-- Statistiques -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Total des projets</p>
                  <p class="text-2xl font-bold text-gray-900">{{ statistiques.total }}</p>
                </div>
                <div class="p-3 bg-blue-100 rounded-full">
                  <i class="fas fa-project-diagram text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
  
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Projets en cours</p>
                  <p class="text-2xl font-bold text-gray-900">{{ statistiques.enCours }}</p>
                </div>
                <div class="p-3 bg-green-100 rounded-full">
                  <i class="fas fa-play-circle text-green-600 text-xl"></i>
                </div>
              </div>
            </div>
  
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-600">Projets terminés</p>
                  <p class="text-2xl font-bold text-gray-900">{{ statistiques.termines }}</p>
                </div>
                <div class="p-3 bg-purple-100 rounded-full">
                  <i class="fas fa-check-circle text-purple-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Messages d'état -->
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {{ error }}
          </div>
  
          <div v-if="message" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {{ message }}
          </div>
  
          <!-- Liste des projets -->
          <div class="bg-white rounded-xl shadow-lg">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-800">Liste des Projets</h2>
            </div>
            
            <div v-if="loading" class="p-8 text-center">
              <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
              <p class="mt-2 text-gray-600">Chargement des projets...</p>
            </div>
  
            <div v-else-if="projets.length === 0" class="p-8 text-center">
              <i class="fas fa-folder-open text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-600">Aucun projet trouvé.</p>
              <button 
                @click="openDialog()" 
                class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Créer votre premier projet
              </button>
            </div>
  
            <div v-else class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projet</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stagiaires</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="projet in projets" :key="projet.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="font-medium text-gray-900">{{ projet.nom }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap gap-1">
                        <span 
                          v-for="stagiaire in projet.stagiaires" 
                          :key="stagiaire"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {{ stagiaire }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{{ formatDate(projet.date_debut) }}</div>
                      <div>→ {{ formatDate(projet.date_fin) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="getStatutClass(projet)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ getStatutText(projet) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        @click="openDialog(projet)"
                        class="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <i class="fas fa-edit mr-1"></i>Modifier
                      </button>
                      <button 
                        @click="confirmerSuppression(projet)"
                        class="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <i class="fas fa-trash mr-1"></i>Supprimer
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Dialog de projet simple -->
      <div v-if="dialogVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ projetEnEdition ? 'Modifier le projet' : 'Nouveau projet' }}
          </h3>
          
          <form @submit.prevent="sauvegarderProjet" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nom du projet</label>
              <input 
                v-model="formulaire.nom"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Entrez le nom du projet"
              >
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stagiaires (séparés par des virgules)</label>
              <input 
                v-model="stagiaireString"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Jean Dupont, Marie Martin, Pierre Durand"
              >
            </div>
  
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input 
                  v-model="formulaire.date_debut"
                  type="date" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input 
                  v-model="formulaire.date_fin"
                  type="date" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>
            </div>
  
            <div class="flex justify-end space-x-4 pt-4">
              <button 
                type="button"
                @click="closeDialog"
                class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-black rounded-lg transition-colors"
              >
                {{ projetEnEdition ? 'Modifier' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Dialog de confirmation de suppression -->
      <div v-if="suppressionDialog.visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer le projet "{{ suppressionDialog.projet?.nom }}" ? 
            Cette action est irréversible.
          </p>
          <div class="flex justify-end space-x-4">
            <button 
              @click="suppressionDialog.visible = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button 
              @click="executerSuppression"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-black rounded-lg transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  console.log('🚀 Page Missions chargée avec succès!')
  
  const router = useRouter()
  
  // Système de persistance amélioré
  const STORAGE_KEY = 'app_missions_data'
  
  // Fonction pour encoder les données en base64 (simple obfuscation)
  const encodeData = (data) => {
    try {
      return btoa(JSON.stringify(data))
    } catch (e) {
      console.error('Erreur encodage:', e)
      return null
    }
  }
  
  // Fonction pour décoder les données
  const decodeData = (encodedData) => {
    try {
      return JSON.parse(atob(encodedData))
    } catch (e) {
      console.error('Erreur décodage:', e)
      return null
    }
  }
  
  // Système de persistance utilisant les propriétés du document
  const saveToMemoryStore = (data) => {
    try {
      const encoded = encodeData(data)
      if (encoded) {
        // Utiliser une propriété personnalisée du document
        document.documentElement.setAttribute('data-app-store', encoded)
        console.log('💾 Données sauvegardées avec succès')
      }
    } catch (e) {
      console.error('Erreur sauvegarde:', e)
    }
  }
  
  const loadFromMemoryStore = () => {
    try {
      const encoded = document.documentElement.getAttribute('data-app-store')
      if (encoded) {
        const data = decodeData(encoded)
        if (data && Array.isArray(data)) {
          console.log('📂 Données récupérées:', data.length, 'projets')
          return data
        }
      }
    } catch (e) {
      console.error('Erreur chargement:', e)
    }
    
    // Données par défaut si aucune donnée trouvée
    console.log('📂 Utilisation des données par défaut')
    return [
      {
        id: '1',
        nom: 'Projet E-commerce',
        stagiaires: ['Alice Martin', 'Bob Dupont'],
        date_debut: '2024-01-15',
        date_fin: '2024-03-15'
      },
      {
        id: '2',
        nom: 'Application Mobile',
        stagiaires: ['Charlie Brown'],
        date_debut: '2024-02-01',
        date_fin: '2024-04-30'
      }
    ]
  }
  
  // États réactifs
  const projets = ref([])
  const loading = ref(false)
  const error = ref('')
  const message = ref('')
  const dialogVisible = ref(false)
  const projetEnEdition = ref(null)
  
  const formulaire = ref({
    nom: '',
    date_debut: '',
    date_fin: ''
  })
  
  const stagiaireString = ref('')
  
  const suppressionDialog = reactive({
    visible: false,
    projet: null
  })
  
  // Fonction pour sauvegarder les données
  const sauvegarderDonnees = () => {
    saveToMemoryStore(projets.value)
  }
  
  // Fonction pour charger les données
  const chargerDonnees = () => {
    projets.value = loadFromMemoryStore()
  }
  
  // Computed
  const userInitial = computed(() => 'U')
  const userName = computed(() => 'Utilisateur')
  
  const statistiques = computed(() => {
    const maintenant = new Date()
    let enCours = 0
    let termines = 0
  
    projets.value.forEach(projet => {
      const debut = new Date(projet.date_debut)
      const fin = new Date(projet.date_fin)
      
      if (fin < maintenant) {
        termines++
      } else if (debut <= maintenant && maintenant <= fin) {
        enCours++
      }
    })
  
    return {
      total: projets.value.length,
      enCours,
      termines
    }
  })
  
  // Méthodes
  const logout = async () => {
    console.log('Déconnexion...')
    // Sauvegarder une dernière fois avant de partir
    sauvegarderDonnees()
    router.push('/login')
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }
  
  const getStatutClass = (projet) => {
    const maintenant = new Date()
    const debut = new Date(projet.date_debut)
    const fin = new Date(projet.date_fin)
    
    if (fin < maintenant) {
      return 'bg-green-100 text-green-800'
    } else if (debut <= maintenant && maintenant <= fin) {
      return 'bg-blue-100 text-blue-800'
    } else {
      return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatutText = (projet) => {
    const maintenant = new Date()
    const debut = new Date(projet.date_debut)
    const fin = new Date(projet.date_fin)
    
    if (fin < maintenant) {
      return 'Terminé'
    } else if (debut <= maintenant && maintenant <= fin) {
      return 'En cours'
    } else {
      return 'À venir'
    }
  }
  
  const openDialog = (projet = null) => {
    console.log('Ouverture dialog:', projet)
    projetEnEdition.value = projet
    
    if (projet) {
      formulaire.value = {
        nom: projet.nom,
        date_debut: projet.date_debut,
        date_fin: projet.date_fin
      }
      stagiaireString.value = projet.stagiaires.join(', ')
    } else {
      formulaire.value = {
        nom: '',
        date_debut: '',
        date_fin: ''
      }
      stagiaireString.value = ''
    }
    
    dialogVisible.value = true
  }
  
  const closeDialog = () => {
    dialogVisible.value = false
    projetEnEdition.value = null
    error.value = ''
  }
  
  const sauvegarderProjet = () => {
    try {
      // Validation simple
      if (!formulaire.value.nom.trim()) {
        error.value = 'Le nom du projet est requis'
        return
      }
  
      const stagiaires = stagiaireString.value
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
  
      const nouveauProjet = {
        ...formulaire.value,
        stagiaires
      }
  
      if (projetEnEdition.value) {
        // Modification
        const index = projets.value.findIndex(p => p.id === projetEnEdition.value.id)
        if (index !== -1) {
          projets.value[index] = { ...projetEnEdition.value, ...nouveauProjet }
          message.value = 'Projet modifié avec succès!'
        }
      } else {
        // Ajout
        const id = Date.now().toString()
        projets.value.push({ id, ...nouveauProjet })
        message.value = 'Projet créé avec succès!'
      }
  
      // Sauvegarder immédiatement
      sauvegarderDonnees()
  
      closeDialog()
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        message.value = ''
      }, 3000)
  
    } catch (err) {
      console.error('Erreur:', err)
      error.value = 'Une erreur est survenue'
    }
  }
  
  const confirmerSuppression = (projet) => {
    suppressionDialog.projet = projet
    suppressionDialog.visible = true
  }
  
  const executerSuppression = () => {
    if (suppressionDialog.projet) {
      const index = projets.value.findIndex(p => p.id === suppressionDialog.projet.id)
      if (index !== -1) {
        projets.value.splice(index, 1)
        message.value = 'Projet supprimé avec succès!'
        
        // Sauvegarder immédiatement
        sauvegarderDonnees()
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          message.value = ''
        }, 3000)
      }
      
      suppressionDialog.visible = false
      suppressionDialog.projet = null
    }
  }
  
  // Auto-sauvegarde périodique
  let autoSaveInterval
  const startAutoSave = () => {
    // Sauvegarder toutes les 30 secondes
    autoSaveInterval = setInterval(() => {
      sauvegarderDonnees()
      console.log('🔄 Auto-sauvegarde effectuée')
    }, 30000)
  }
  
  const stopAutoSave = () => {
    if (autoSaveInterval) {
      clearInterval(autoSaveInterval)
    }
  }
  
  // Sauvegarder avant de quitter la page
  const handleBeforeUnload = () => {
    sauvegarderDonnees()
  }
  
  onMounted(() => {
    console.log('✅ Composant Missions monté!')
    
    // Charger les données au démarrage
    chargerDonnees()
    
    // Démarrer l'auto-sauvegarde
    startAutoSave()
    
    // Écouter l'événement de fermeture de page
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Nettoyer lors du démontage
    return () => {
      stopAutoSave()
      window.removeEventListener('beforeunload', handleBeforeUnload)
      // Sauvegarder une dernière fois
      sauvegarderDonnees()
    }
  })
  </script>
  
  <style scoped>
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
  
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
  
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
  
  .space-x-4 > * + * {
    margin-left: 1rem;
  }
  
  .grid {
    display: grid;
  }
  
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  .gap-1 {
    gap: 0.25rem;
  }
  
  .gap-4 {
    gap: 1rem;
  }
  
  .gap-6 {
    gap: 1.5rem;
  }
  
  @media (min-width: 768px) {
    .md\\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  </style>