<template>
  <AuthLayout>
    <div
      class="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-10 w-full max-w-md mx-auto"
    >
      <!-- En-tête avec logo et titre -->
      <div class="flex flex-col items-center mb-8 gap-4">
        <AppLogo />
        <h1 class="text-2xl font-semibold text-gray-900">Connexion</h1>
      </div>

      <!-- Formulaire de connexion -->
      <div class="mb-6">
        <v-form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
          <v-text-field
            v-model="formData.email"
            label="Adresse email"
            type="email"
            autocomplete="email"
            prepend-inner-icon="mdi-email"
            required
            density="comfortable"
            class="flat-input"
            placeholder="Entrez votre adresse email"
            variant="solo"
            color="primary"
          />
          <v-text-field
            v-model="formData.password"
            label="Mot de passe"
            type="password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock"
            required
            density="comfortable"
            class="flat-input"
            placeholder="Entrez votre mot de passe"
            variant="solo"
            color="primary"
          />
          <div class="flex justify-end mb-2">
            <v-btn
              variant="text"
              size="small"
              color="primary"
              class="px-0 text-sm"
              @click="onForgotPassword"
            >
              Mot de passe oublié ?
            </v-btn>
          </div>
          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            variant="flat"
            class="rounded-xl font-medium text-base py-4 mt-2"
          >
            <span class="normal-case"> Se connecter </span>
          </v-btn>
        </v-form>
      </div>

      <!-- Séparateur -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-4 text-gray-500">ou</span>
        </div>
      </div>

      <!-- Section création de compte -->
      <div class="text-center">
        <p class="text-gray-600 text-sm mb-4">Pas encore de compte ?</p>
        <router-link to="/register">
          <v-btn
            variant="outlined"
            color="primary"
            class="w-full rounded-xl border-2"
            size="large"
          >
            <span class="normal-case"> Créer un compte </span>
          </v-btn>
        </router-link>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppLogo from "@/components/Logo.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

defineOptions({
  name: "LoginPage",
});

const router = useRouter();

const formData = ref({
  email: "",
  password: "",
});

const onForgotPassword = () => {
  alert("Lien de récupération de mot de passe (à implémenter)");
};

const handleSubmit = () => {
  if (!formData.value.email || !formData.value.password) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }
  console.log("Données de connexion:", formData.value);
  alert("Connexion réussie ! (simulation)");
  router.push("/");
};
</script>

<style scoped>
.flat-input .v-input__control {
  box-shadow: none !important;
  border-radius: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}
.flat-input .v-input__control:hover {
  border-color: #cbd5e1;
}
.flat-input .v-input__control:focus-within {
  border-color: #3b82f6;
  background: #ffffff;
}
.flat-input .v-field__outline {
  border: none !important;
}
</style>
