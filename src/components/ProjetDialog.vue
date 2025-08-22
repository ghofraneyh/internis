<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)" 
    max-width="600"
    persistent
  >
    <v-card class="rounded-2xl">
      <v-card-title class="bg-primary text-white rounded-t-2xl pa-6">
        <div class="d-flex align-center ga-3">
          <div class="bg-white bg-opacity-20 rounded-pill pa-2">
            <v-icon color="white">{{ projet ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          </div>
          <div>
            <h2 class="text-h6 font-weight-medium">{{ title }}</h2>
            <p class="text-body-2 text-white text-opacity-90 mb-0">
              {{ projet ? 'Modifier les informations du projet' : 'Créer un nouveau projet' }}
            </p>
          </div>
        </div>
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-form ref="form" v-model="valid">
          <!-- Nom du projet -->
          <div class="bg-grey-lighten-4 rounded-xl pa-4 mb-4">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon color="primary" size="20">mdi-clipboard-text</v-icon>
              <span class="text-body-2 font-weight-medium text-grey-darken-2">Informations du projet</span>
            </div>
            <v-text-field
              v-model="formData.nom"
              label="Nom du projet"
              :rules="[rules.required]"
              required
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-folder"
              placeholder="Entrez le nom du projet..."
            ></v-text-field>
          </div>

          <!-- Stagiaires -->
          <div class="bg-grey-lighten-4 rounded-xl pa-4 mb-4">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon color="primary" size="20">mdi-account-group</v-icon>
              <span class="text-body-2 font-weight-medium text-grey-darken-2">Équipe du projet</span>
            </div>
            <v-combobox
              v-model="formData.stagiaires"
              label="Stagiaires assignés"
              multiple
              chips
              clearable
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account-multiple"
              placeholder="Ajoutez des stagiaires..."
              hint="Appuyez sur Entrée pour ajouter un stagiaire"
              persistent-hint
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  color="secondary"
                  size="small"
                  closable
                >
                  <template v-slot:prepend>
                    <v-icon size="14">mdi-account</v-icon>
                  </template>
                  {{ item.raw }}
                </v-chip>
              </template>
            </v-combobox>
          </div>

          <!-- Dates -->
          <div class="bg-grey-lighten-4 rounded-xl pa-4 mb-4">
            <div class="d-flex align-center ga-2 mb-3">
              <v-icon color="primary" size="20">mdi-calendar-range</v-icon>
              <span class="text-body-2 font-weight-medium text-grey-darken-2">Planning du projet</span>
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.date_debut"
                  label="Date de début"
                  type="date"
                  :rules="[rules.required]"
                  required
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-calendar-start"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.date_fin"
                  label="Date de fin"
                  type="date"
                  :rules="[rules.required, rules.dateFin]"
                  required
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-calendar-end"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <!-- Durée calculée -->
            <v-alert
              v-if="formData.date_debut && formData.date_fin"
              type="info"
              variant="tonal"
              class="mt-3"
            >
              <template v-slot:prepend>
                <v-icon>mdi-clock-outline</v-icon>
              </template>
              Durée du projet : {{ calculerDuree() }} jour{{ calculerDuree() > 1 ? 's' : '' }}
            </v-alert>
          </div>

          <!-- Aperçu du projet -->
          <v-card
            v-if="formData.nom"
            variant="tonal"
            color="primary"
            class="mb-4"
          >
            <v-card-title class="text-body-1 pb-2">
              <v-icon class="mr-2">mdi-eye</v-icon>
              Aperçu du projet
            </v-card-title>
            <v-card-text>
              <v-card variant="flat" class="bg-white">
                <v-card-text>
                  <h3 class="text-h6 text-grey-darken-2 mb-2">{{ formData.nom }}</h3>
                  <div class="d-flex flex-wrap ga-2 mb-2">
                    <v-chip
                      v-for="stagiaire in formData.stagiaires"
                      :key="stagiaire"
                      size="small"
                      color="secondary"
                    >
                      {{ stagiaire }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    <span v-if="formData.date_debut">Du {{ formatDatePreview(formData.date_debut) }}</span>
                    <span v-if="formData.date_fin"> au {{ formatDatePreview(formData.date_fin) }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn 
          @click="$emit('update:modelValue', false)"
          variant="outlined"
          class="mr-2"
          prepend-icon="mdi-close"
        >
          Annuler
        </v-btn>
        <v-btn 
          @click="save" 
          color="primary" 
          :disabled="!valid"
          :loading="loading"
          :prepend-icon="projet ? 'mdi-check' : 'mdi-plus'"
        >
          {{ projet ? 'Modifier' : 'Créer' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

// Types
interface Projet {
  id?: string
  nom: string
  stagiaires: string[]
  date_debut: string
  date_fin: string
  created_at?: string
  updated_at?: string
}

interface Props {
  modelValue: boolean
  title: string
  projet?: Projet | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', projet: Omit<Projet, 'id' | 'created_at' | 'updated_at'>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Refs
const form = ref()
const valid = ref(false)
const loading = ref(false)

const formData = ref({
  nom: '',
  stagiaires: [] as string[],
  date_debut: '',
  date_fin: ''
})

// Rules
const rules = {
  required: (v: any) => {
    if (Array.isArray(v)) return v.length > 0 || 'Au moins un élément est requis'
    return !!v || 'Ce champ est requis'
  },
  dateFin: (v: string) => {
    if (!v || !formData.value.date_debut) return true
    return new Date(v) >= new Date(formData.value.date_debut) || 'La date de fin doit être postérieure à la date de début'
  }
}

// Methods
const resetForm = () => {
  formData.value = {
    nom: '',
    stagiaires: [],
    date_debut: '',
    date_fin: ''
  }
  nextTick(() => {
    form.value?.resetValidation()
  })
}

const calculerDuree = () => {
  if (!formData.value.date_debut || !formData.value.date_fin) return 0
  const debut = new Date(formData.value.date_debut)
  const fin = new Date(formData.value.date_fin)
  const diffTime = Math.abs(fin.getTime() - debut.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const formatDatePreview = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const save = async () => {
  loading.value = true
  try {
    const { valid: isValid } = await form.value.validate()
    if (isValid) {
      // Simulation d'un délai pour l'UX
      await new Promise(resolve => setTimeout(resolve, 500))
      emit('save', { ...formData.value })
      resetForm()
    }
  } finally {
    loading.value = false
  }
}

// Watchers
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.projet) {
      formData.value = {
        nom: props.projet.nom,
        stagiaires: [...props.projet.stagiaires],
        date_debut: props.projet.date_debut,
        date_fin: props.projet.date_fin
      }
    } else {
      resetForm()
    }
  }
})
</script>

<style scoped>
.v-card {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.bg-opacity-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

.text-opacity-90 {
  color: rgba(255, 255, 255, 0.9);
}
</style>