<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import ProjetFormDialog from "@/components/ProjetFormDialog.vue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import { supabase } from "@/composables/useSupabase";

console.log("🚀 Page Missions chargée avec succès!");

const router = useRouter();

// Types
interface Projet {
  id: string;
  nom: string;
  stagiaires: string[];
  date_debut: string;
  date_fin: string;
}

// États réactifs
const projets = ref<Projet[]>([]);
const loading = ref(false);
const loadingGetProjets = ref(false);
const error = ref("");
const message = ref("");
const dialogVisible = ref(false);
const projetEnEdition = ref<Projet | null>(null);
const deleteDialogVisible = ref(false);
const projetASupprimer = ref<Projet | null>(null);

// Computed
const userInitial = computed(() => "U");
const userName = computed(() => "Utilisateur");

const statistiques = computed(() => {
  const maintenant = new Date();
  let enCours = 0;
  let termines = 0;

  projets.value.forEach((projet) => {
    const debut = new Date(projet.date_debut);
    const fin = new Date(projet.date_fin);

    if (fin < maintenant) {
      termines++;
    } else if (debut <= maintenant && maintenant <= fin) {
      enCours++;
    }
  });

  return {
    total: projets.value.length,
    enCours,
    termines,
  };
});

// Configuration du tableau Vuetify
const headers = computed(() => [
  {
    title: "Projet",
    align: "start" as const,
    sortable: true,
    key: "nom",
  },
  {
    title: "Stagiaires",
    align: "start" as const,
    sortable: false,
    key: "stagiaires",
  },
  {
    title: "Date début",
    align: "start" as const,
    sortable: true,
    key: "date_debut",
  },
  {
    title: "Date fin",
    align: "start" as const,
    sortable: true,
    key: "date_fin",
  },
  {
    title: "Statut",
    align: "center" as const,
    sortable: true,
    key: "statut",
  },
  {
    title: "Actions",
    align: "center" as const,
    sortable: false,
    key: "actions",
  },
]);

// Méthodes
const logout = async (): Promise<void> => {
  console.log("Déconnexion...");
  router.push("/login");
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

const getStatutText = (projet: Projet): string => {
  const maintenant = new Date();
  const debut = new Date(projet.date_debut);
  const fin = new Date(projet.date_fin);

  if (fin < maintenant) {
    return "Terminé";
  } else if (debut <= maintenant && maintenant <= fin) {
    return "En cours";
  } else {
    return "À venir";
  }
};

const getStatutColor = (projet: Projet): string => {
  const maintenant = new Date();
  const debut = new Date(projet.date_debut);
  const fin = new Date(projet.date_fin);

  if (fin < maintenant) {
    return "success";
  } else if (debut <= maintenant && maintenant <= fin) {
    return "primary";
  } else {
    return "secondary";
  }
};

const openDialog = (projet: Projet | null = null): void => {
  console.log("Ouverture dialog:", projet);
  projetEnEdition.value = projet;
  dialogVisible.value = true;
};

const closeDialog = (): void => {
  dialogVisible.value = false;
  projetEnEdition.value = null;
  error.value = "";
};

const sauvegarderProjet = (projetData: Omit<Projet, "id">): void => {
  try {
  } catch (err) {
    console.error("Erreur:", err);
    error.value = "Une erreur est survenue";
  }
};

const confirmerSuppression = (projet: Projet): void => {
  projetASupprimer.value = projet;
  deleteDialogVisible.value = true;
};

const executerSuppression = (): void => {};

onMounted(async () => {
  console.log(" mounted ready");
  try {
    loadingGetProjets.value = true;
    //const sleep = await new Promise((resolve) => setTimeout(resolve, 5000));
    const { data, error } = await supabase.from("projets").select("*");
    projets.value = data as Projet[];
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    loadingGetProjets.value = false;
  }
});
</script>
<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar
        :user-initial="userInitial"
        :user-name="userName"
        @logout="logout"
      />

      <!-- Contenu principal -->
      <div class="flex-1 p-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              Gestion des Missions
            </h1>
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
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  Total des projets
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ statistiques.total }}
                </p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full">
                <i class="fas fa-project-diagram text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  Projets en cours
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ statistiques.enCours }}
                </p>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <i class="fas fa-play-circle text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  Projets terminés
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ statistiques.termines }}
                </p>
              </div>
              <div class="p-3 bg-purple-100 rounded-full">
                <i class="fas fa-check-circle text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages d'état -->
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        >
          {{ error }}
        </div>

        <div
          v-if="message"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
        >
          {{ message }}
        </div>

        <!-- Liste des projets -->
        <v-card class="elevation-4">
          <v-card-title class="text-h5 pa-6 border-b">
            Liste des Projets
          </v-card-title>

          <v-card-text v-if="loading" class="text-center pa-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <p class="mt-4 text-grey-600">Chargement des projets...</p>
          </v-card-text>

          <v-card-text
            v-else-if="projets.length === 0 && !loadingGetProjets"
            class="text-center pa-8"
          >
            <v-icon size="64" color="grey-lighten-1" class="mb-4"
              >mdi-folder-open-outline</v-icon
            >
            <p class="text-grey-600 mb-4">Aucun projet trouvé.</p>
            <v-btn @click="openDialog()" color="primary" variant="elevated">
              Créer votre premier projet
            </v-btn>
          </v-card-text>

          <v-data-table
            v-else
            :headers="headers"
            :items="projets"
            :loading="loadingGetProjets"
            class="elevation-0"
            item-value="id"
            loading-text="Chargement des missions..."
          >
            <!-- Colonne Stagiaires -->
            <template #item.stagiaires="{ item }">
              <div class="d-flex flex-wrap ga-1">
                <v-chip
                  v-for="stagiaire in item.stagiaires"
                  :key="stagiaire"
                  size="small"
                  color="primary"
                  variant="tonal"
                >
                  {{ stagiaire }}
                </v-chip>
              </div>
            </template>

            <!-- Colonne Date début -->
            <template #item.date_debut="{ item }">
              {{ formatDate(item.date_debut) }}
            </template>

            <!-- Colonne Date fin -->
            <template #item.date_fin="{ item }">
              {{ formatDate(item.date_fin) }}
            </template>

            <!-- Colonne Statut -->
            <template #item.statut="{ item }">
              <v-chip
                :color="getStatutColor(item)"
                variant="tonal"
                size="small"
              >
                {{ getStatutText(item) }}
              </v-chip>
            </template>

            <!-- Colonne Actions -->
            <template #item.actions="{ item }">
              <v-btn
                @click="openDialog(item)"
                icon="mdi-pencil"
                variant="text"
                color="primary"
                size="small"
                class="mr-2"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="top">
                  Modifier
                </v-tooltip>
              </v-btn>
              <v-btn
                @click="confirmerSuppression(item)"
                icon="mdi-delete"
                variant="text"
                color="error"
                size="small"
              >
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">
                  Supprimer
                </v-tooltip>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>

    <!-- Dialog de formulaire de projet -->
    <ProjetFormDialog
      v-model="dialogVisible"
      :projet="projetEnEdition"
      :loading="loading"
      @save="sauvegarderProjet"
    />

    <!-- Dialog de confirmation de suppression -->
    <ConfirmDeleteDialog
      v-model="deleteDialogVisible"
      title="Confirmer la suppression"
      message="Êtes-vous sûr de vouloir supprimer le projet"
      :item-name="projetASupprimer?.nom"
      :loading="loading"
      @confirm="executerSuppression"
    />
  </div>
</template>
