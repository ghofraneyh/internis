<script setup lang="ts">
import { ref } from "vue";
import BaseDialog from "./BaseDialog.vue";

// États pour différents types de dialogues
const infoDialog = ref(false);
const warningDialog = ref(false);
const errorDialog = ref(false);
const customDialog = ref(false);

const handleInfoConfirm = () => {
  console.log("Action confirmée pour le dialogue info");
  infoDialog.value = false;
};

const handleWarningConfirm = () => {
  console.log("Action confirmée pour le dialogue warning");
  warningDialog.value = false;
};

const handleErrorConfirm = () => {
  console.log("Action confirmée pour le dialogue error");
  errorDialog.value = false;
};

const handleCustomConfirm = () => {
  console.log("Action confirmée pour le dialogue personnalisé");
  customDialog.value = false;
};
</script>

<template>
  <div class="pa-4">
    <h2 class="text-h5 mb-4">Exemples d'utilisation du BaseDialog</h2>

    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-btn color="info" block @click="infoDialog = true">
          Dialogue Info
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-btn color="warning" block @click="warningDialog = true">
          Dialogue Warning
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-btn color="error" block @click="errorDialog = true">
          Dialogue Error
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-btn color="success" block @click="customDialog = true">
          Dialogue Personnalisé
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dialogue Info -->
    <BaseDialog
      v-model="infoDialog"
      title="Information"
      subtitle="Ceci est un message informatif"
      type="info"
      confirm-text="Compris"
      :show-actions="true"
      @confirm="handleInfoConfirm"
    >
      <div class="pa-6">
        <p>
          Ce dialogue utilise le type "info" avec une icône et une couleur
          appropriées.
        </p>
        <p class="text-caption text-medium-emphasis mt-2">
          Vous pouvez personnaliser le contenu en utilisant le slot par défaut.
        </p>
      </div>
    </BaseDialog>

    <!-- Dialogue Warning -->
    <BaseDialog
      v-model="warningDialog"
      title="Attention"
      subtitle="Action nécessitant une confirmation"
      type="warning"
      confirm-text="Continuer"
      cancel-text="Annuler"
      :show-actions="true"
      @confirm="handleWarningConfirm"
    >
      <div class="pa-6">
        <p>
          Ce dialogue utilise le type "warning" pour les actions qui nécessitent
          une attention particulière.
        </p>
        <v-alert type="warning" variant="tonal" class="mt-4">
          Cette action peut avoir des conséquences importantes.
        </v-alert>
      </div>
    </BaseDialog>

    <!-- Dialogue Error -->
    <BaseDialog
      v-model="errorDialog"
      title="Erreur"
      subtitle="Une erreur s'est produite"
      type="error"
      confirm-text="OK"
      :show-actions="true"
      @confirm="handleErrorConfirm"
    >
      <div class="pa-6">
        <p>Ce dialogue utilise le type "error" pour afficher les erreurs.</p>
        <v-alert type="error" variant="tonal" class="mt-4">
          Détails de l'erreur : Impossible de charger les données.
        </v-alert>
      </div>
    </BaseDialog>

    <!-- Dialogue Personnalisé -->
    <BaseDialog
      v-model="customDialog"
      title="Dialogue Personnalisé"
      type="form"
      :width="800"
      :max-width="'90vw'"
      confirm-text="Valider"
      cancel-text="Fermer"
      confirm-color="success"
      confirm-icon="mdi-check-circle"
      :show-actions="true"
      @confirm="handleCustomConfirm"
    >
      <div class="pa-6">
        <h3 class="text-h6 mb-4">Contenu personnalisé</h3>
        <p>
          Ce dialogue montre comment personnaliser complètement le BaseDialog :
        </p>

        <v-list class="mt-4">
          <v-list-item>
            <template #prepend>
              <v-icon color="success">mdi-check</v-icon>
            </template>
            <v-list-item-title>Largeur personnalisée</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon color="success">mdi-check</v-icon>
            </template>
            <v-list-item-title>Couleurs personnalisées</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon color="success">mdi-check</v-icon>
            </template>
            <v-list-item-title>Icônes personnalisées</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon color="success">mdi-check</v-icon>
            </template>
            <v-list-item-title>Contenu flexible</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </BaseDialog>
  </div>
</template>
