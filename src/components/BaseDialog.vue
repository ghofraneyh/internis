<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: boolean;
  title?: string;
  subtitle?: string;
  type?: "form" | "confirm" | "info" | "warning" | "error";
  width?: string | number;
  persistent?: boolean;
  maxWidth?: string | number;
  fullscreen?: boolean;
  scrollable?: boolean;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  showActions?: boolean;
  confirmColor?: string;
  cancelColor?: string;
  confirmIcon?: string;
  cancelIcon?: string;
  elevation?: number;
  rounded?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  subtitle: "",
  type: "form",
  width: 500,
  persistent: false,
  maxWidth: "90vw",
  fullscreen: false,
  scrollable: false,
  loading: false,
  confirmText: "Confirmer",
  cancelText: "Annuler",
  showActions: true,
  confirmColor: "primary",
  cancelColor: "grey",
  confirmIcon: "mdi-check",
  cancelIcon: "mdi-close",
  elevation: 24,
  rounded: "lg",
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  confirm: [];
  cancel: [];
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleConfirm = () => {
  emit("confirm");
};

const handleCancel = () => {
  emit("cancel");
  dialogVisible.value = false;
};

const handleClose = () => {
  dialogVisible.value = false;
};

const getTypeColor = computed(() => {
  switch (props.type) {
    case "warning":
      return "warning";
    case "error":
      return "error";
    case "info":
      return "info";
    case "confirm":
      return "warning";
    default:
      return "primary";
  }
});

const getTypeIcon = computed(() => {
  switch (props.type) {
    case "warning":
      return "mdi-alert";
    case "error":
      return "mdi-alert-circle";
    case "info":
      return "mdi-information";
    case "confirm":
      return "mdi-help-circle";
    default:
      return "mdi-dialog";
  }
});

const getTypeBackground = computed(() => {
  switch (props.type) {
    case "warning":
      return "warning-lighten-5";
    case "error":
      return "error-lighten-5";
    case "info":
      return "info-lighten-5";
    case "confirm":
      return "warning-lighten-5";
    default:
      return "primary-lighten-5";
  }
});
</script>

<template>
  <v-dialog
    v-model="dialogVisible"
    :width="width"
    :persistent="persistent"
    :max-width="maxWidth"
    :fullscreen="fullscreen"
    :scrollable="scrollable"
    :elevation="elevation"
    :rounded="rounded"
    transition="dialog-bottom-transition"
    @click:outside="handleClose"
  >
    <v-card
      :elevation="elevation"
      :rounded="rounded"
      class="overflow-hidden"
      :class="getTypeBackground"
    >
      <!-- Header avec gradient et icône -->
      <v-card-title
        v-if="title"
        class="d-flex align-center pa-6 pb-4"
        :class="`bg-${getTypeColor}-lighten-1`"
      >
        <v-avatar
          v-if="type !== 'form'"
          :color="getTypeColor"
          size="40"
          class="mr-4"
        >
          <v-icon :icon="getTypeIcon" size="20" />
        </v-avatar>

        <div class="flex-grow-1">
          <h2 class="text-h5 font-weight-bold mb-1">
            {{ title }}
          </h2>
          <p v-if="subtitle" class="text-subtitle-1 text-opacity-80 mb-0">
            {{ subtitle }}
          </p>
        </div>

        <v-btn
          v-if="!persistent"
          icon="mdi-close"
          variant="text"
          size="small"
          class="ml-2"
          @click="handleClose"
        />
      </v-card-title>

      <!-- Contenu principal -->
      <v-card-text
        :class="{
          'pa-0': type === 'form',
          'pa-6': type !== 'form',
          'max-height-70vh': scrollable,
        }"
        class="overflow-y-auto"
      >
        <slot />
      </v-card-text>

      <!-- Actions avec design amélioré -->
      <v-card-actions v-if="showActions" class="pa-6 pt-4 bg-grey-lighten-5">
        <v-spacer />

        <!-- Bouton Annuler -->
        <v-btn
          v-if="cancelText"
          :color="cancelColor"
          variant="tonal"
          size="large"
          class="mr-3"
          :disabled="loading"
          @click="handleCancel"
        >
          <v-icon v-if="cancelIcon" :icon="cancelIcon" size="18" />
          <span class="text-sm normal-case">{{ cancelText }}</span>
        </v-btn>

        <!-- Bouton Confirmer -->
        <v-btn
          v-if="confirmText"
          :color="confirmColor"
          variant="tonal"
          size="large"
          :loading="loading"
          :disabled="loading"
          @click="handleConfirm"
        >
          <v-icon
            v-if="confirmIcon && !loading"
            :icon="confirmIcon"
            size="18"
          />
          <span class="text-sm normal-case">{{ confirmText }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-text {
  max-height: 70vh;
  overflow-y: auto;
}

.v-card-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* Animations et transitions */
.v-dialog {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-card:hover {
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 600px) {
  .v-card-title {
    padding: 1rem !important;
  }

  .v-card-text {
    padding: 1rem !important;
  }

  .v-card-actions {
    padding: 1rem !important;
    flex-direction: column;
    gap: 0.5rem;
  }

  .v-btn {
    width: 100%;
  }
}

/* Amélioration de l'accessibilité */
.v-btn:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Effet de profondeur pour les boutons */
.v-btn--elevated {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.v-btn--elevated:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.16);
  transform: translateY(-1px);
}

/* Style pour les types de dialogue */
.bg-warning-lighten-5 {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.bg-error-lighten-5 {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
}

.bg-info-lighten-5 {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.bg-primary-lighten-5 {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}
</style>
