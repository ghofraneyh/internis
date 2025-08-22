<script setup lang="ts">
import { computed } from "vue";
import BaseDialog from "./BaseDialog.vue";

interface Props {
  modelValue: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
  severity?: "warning" | "error" | "info";
}

const props = withDefaults(defineProps<Props>(), {
  title: "Confirmer la suppression",
  message: "Êtes-vous sûr de vouloir supprimer cet élément ?",
  itemName: "",
  loading: false,
  severity: "warning",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
}>();

// Variable locale pour gérer le v-model
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("update:modelValue", false);
};

// Computed pour adapter le type selon la sévérité
const getDialogType = computed(() => {
  switch (props.severity) {
    case "error":
      return "error";
    case "info":
      return "info";
    default:
      return "confirm";
  }
});

const getConfirmColor = computed(() => {
  switch (props.severity) {
    case "error":
      return "error";
    case "info":
      return "info";
    default:
      return "warning";
  }
});

const getIcon = computed(() => {
  switch (props.severity) {
    case "error":
      return "mdi-delete-alert";
    case "info":
      return "mdi-information";
    default:
      return "mdi-delete";
  }
});
</script>

<template>
  <BaseDialog
    v-model="dialogVisible"
    :title="title"
    :type="getDialogType"
    :width="500"
    :loading="loading"
    :persistent="true"
    confirm-text="Supprimer"
    cancel-text="Annuler"
    :confirm-color="getConfirmColor"
    :confirm-icon="getIcon"
    :elevation="20"
    :rounded="'xl'"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="pa-6">
      <!-- Message principal -->
      <div class="text-center mb-6">
        <v-icon
          :icon="getIcon"
          :color="getConfirmColor"
          size="64"
          class="mb-4"
        />

        <h3 class="text-h6 font-weight-medium mb-3">
          {{ message }}
        </h3>

        <p v-if="itemName" class="text-body-1 text-medium-emphasis">
          <span class="font-weight-bold text-error"> "{{ itemName }}" </span>
        </p>
      </div>

      <!-- Détails supplémentaires -->
      <v-card variant="outlined" :color="getConfirmColor" class="mb-4">
        <v-card-text class="text-center">
          <v-icon
            :icon="getIcon"
            :color="getConfirmColor"
            size="24"
            class="mb-2"
          />
          <p class="text-caption text-medium-emphasis mb-0">
            Cette action est irréversible et ne peut pas être annulée.
          </p>
        </v-card-text>
      </v-card>

      <!-- Avertissement selon la sévérité -->
      <v-alert :type="severity" variant="tonal" class="mb-4">
        <template #prepend>
          <v-icon :icon="getIcon" />
        </template>
        <div v-if="severity === 'error'">
          <strong>Attention :</strong> Cette suppression est critique et peut
          affecter d'autres éléments du système.
        </div>
        <div v-else-if="severity === 'info'">
          <strong>Information :</strong> Cette action est réversible depuis la
          corbeille.
        </div>
        <div v-else>
          <strong>Avertissement :</strong> Assurez-vous de sauvegarder toutes
          les données importantes avant de continuer.
        </div>
      </v-alert>

      <!-- Actions rapides -->
      <div class="d-flex justify-space-between align-center mt-6">
        <v-btn
          variant="outlined"
          color="grey"
          size="small"
          @click="handleCancel"
        >
          <v-icon icon="mdi-arrow-left" start size="16" />
          Retour
        </v-btn>

        <v-btn
          :color="getConfirmColor"
          variant="tonal"
          size="large"
          :loading="loading"
          :disabled="loading"
          @click="handleConfirm"
        >
          <v-icon :icon="getIcon" start size="18" />
          Confirmer la suppression
        </v-btn>
      </div>
    </div>
  </BaseDialog>
</template>

<style scoped>
.v-icon {
  transition: all 0.3s ease;
}

.v-icon:hover {
  transform: scale(1.1);
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

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
  .v-icon {
    font-size: 48px !important;
  }

  .text-h6 {
    font-size: 1.1rem !important;
  }

  .d-flex {
    flex-direction: column;
    gap: 1rem;
  }

  .v-btn {
    width: 100%;
  }
}
</style>
