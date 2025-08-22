<script setup lang="ts">
import { ref, watch, computed } from "vue";
import BaseDialog from "./BaseDialog.vue";

interface Projet {
  id: string;
  nom: string;
  stagiaires: string[];
  date_debut: string;
  date_fin: string;
}

interface Props {
  modelValue: boolean;
  projet?: Projet | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  projet: null,
  loading: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  save: [projet: Omit<Projet, "id">];
}>();

const formulaire = ref({
  nom: "",
  date_debut: "",
  date_fin: "",
  stagiaireString: "",
});

const error = ref("");

// Variable locale pour gérer le v-model
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

// Réinitialiser le formulaire quand le projet change
watch(
  () => props.projet,
  (nouveauProjet) => {
    if (nouveauProjet) {
      formulaire.value = {
        nom: nouveauProjet.nom,
        date_debut: nouveauProjet.date_debut,
        date_fin: nouveauProjet.date_fin,
        stagiaireString: nouveauProjet.stagiaires.join(", "),
      };
    } else {
      formulaire.value = {
        nom: "",
        date_debut: "",
        date_fin: "",
        stagiaireString: "",
      };
    }
    error.value = "";
  },
  { immediate: true }
);

const handleSave = () => {
  // Validation
  if (!formulaire.value.nom.trim()) {
    error.value = "Le nom du projet est requis";
    return;
  }

  if (!formulaire.value.date_debut) {
    error.value = "La date de début est requise";
    return;
  }

  if (!formulaire.value.date_fin) {
    error.value = "La date de fin est requise";
    return;
  }

  if (
    new Date(formulaire.value.date_fin) <= new Date(formulaire.value.date_debut)
  ) {
    error.value = "La date de fin doit être postérieure à la date de début";
    return;
  }

  const stagiaires = formulaire.value.stagiaireString
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const projetData = {
    nom: formulaire.value.nom.trim(),
    date_debut: formulaire.value.date_debut,
    date_fin: formulaire.value.date_fin,
    stagiaires,
  };

  emit("save", projetData);
};

const handleCancel = () => {
  emit("update:modelValue", false);
  error.value = "";
};

// Computed pour la validation en temps réel
const isFormValid = computed(() => {
  return (
    formulaire.value.nom.trim() &&
    formulaire.value.date_debut &&
    formulaire.value.date_fin &&
    new Date(formulaire.value.date_fin) > new Date(formulaire.value.date_debut)
  );
});

const getMinDate = computed(() => {
  return formulaire.value.date_debut || new Date().toISOString().split("T")[0];
});
</script>

<template>
  <BaseDialog
    v-model="dialogVisible"
    :title="projet ? 'Modifier le projet' : 'Nouveau projet'"
    type="form"
    :width="700"
    :loading="loading"
    confirm-text="Sauvegarder"
    cancel-text="Annuler"
    :elevation="16"
    :rounded="'xl'"
    @confirm="handleSave"
    @cancel="handleCancel"
  >
    <div class="pa-6">
      <!-- Message d'erreur avec design amélioré -->
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-6"
        closable
        @click:close="error = ''"
      >
        <template #prepend>
          <v-icon icon="mdi-alert-circle" />
        </template>
        {{ error }}
      </v-alert>

      <v-form @submit.prevent="handleSave" class="space-y-6">
        <!-- Nom du projet -->
        <v-text-field
          v-model="formulaire.nom"
          label="Nom du projet"
          placeholder="Entrez le nom du projet"
          variant="outlined"
          :rules="[(v) => !!v || 'Le nom du projet est requis']"
          required
          prepend-inner-icon="mdi-folder"
          :error-messages="
            error && !formulaire.nom.trim() ? 'Le nom est requis' : ''
          "
          class="mb-4"
        />

        <!-- Stagiaires -->
        <v-text-field
          v-model="formulaire.stagiaireString"
          label="Stagiaires"
          placeholder="Ex: Jean Dupont, Marie Martin, Pierre Durand"
          variant="outlined"
          prepend-inner-icon="mdi-account-group"
          hint="Séparez les noms par des virgules"
          persistent-hint
          class="mb-4"
        />

        <!-- Dates -->
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formulaire.date_debut"
              label="Date de début"
              type="date"
              variant="outlined"
              :rules="[(v) => !!v || 'La date de début est requise']"
              required
              prepend-inner-icon="mdi-calendar-start"
              :error-messages="
                error && !formulaire.date_debut
                  ? 'La date de début est requise'
                  : ''
              "
              :min="new Date().toISOString().split('T')[0]"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="formulaire.date_fin"
              label="Date de fin"
              type="date"
              variant="outlined"
              :rules="[
                (v) => !!v || 'La date de fin est requise',
                (v) =>
                  new Date(v) > new Date(formulaire.date_debut) ||
                  'La date de fin doit être postérieure à la date de début',
              ]"
              required
              prepend-inner-icon="mdi-calendar-end"
              :error-messages="
                error && !formulaire.date_fin
                  ? 'La date de fin est requise'
                  : ''
              "
              :min="getMinDate"
            />
          </v-col>
        </v-row>

        <!-- Aperçu des stagiaires -->
        <v-card
          v-if="formulaire.stagiaireString"
          variant="outlined"
          class="mt-4"
          color="info"
        >
          <v-card-title class="text-subtitle-1 pa-4 pb-2">
            <v-icon icon="mdi-account-group" class="mr-2" />
            Stagiaires ({{
              formulaire.stagiaireString.split(",").filter((s) => s.trim())
                .length
            }})
          </v-card-title>
          <v-card-text class="pt-0">
            <v-chip
              v-for="stagiaire in formulaire.stagiaireString
                .split(',')
                .filter((s) => s.trim())"
              :key="stagiaire"
              color="info"
              variant="tonal"
              class="ma-1"
              size="small"
            >
              {{ stagiaire.trim() }}
            </v-chip>
          </v-card-text>
        </v-card>

        <!-- Validation en temps réel -->
        <v-alert v-if="isFormValid" type="success" variant="tonal" class="mt-4">
          <template #prepend>
            <v-icon icon="mdi-check-circle" />
          </template>
          Le formulaire est valide et prêt à être sauvegardé.
        </v-alert>
      </v-form>
    </div>
  </BaseDialog>
</template>

<style scoped>
.space-y-6 > * + * {
  margin-top: 1.5rem;
}

.v-text-field {
  transition: all 0.3s ease;
}

.v-text-field:focus-within {
  transform: translateY(-1px);
}

.v-chip {
  transition: all 0.2s ease;
}

.v-chip:hover {
  transform: scale(1.05);
}

/* Animation pour les alertes */
.v-alert {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 600px) {
  .v-row {
    margin: 0;
  }

  .v-col {
    padding: 0.5rem;
  }
}
</style>
