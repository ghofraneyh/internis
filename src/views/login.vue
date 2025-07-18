<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppLogo from "@/components/Logo.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";

defineOptions({
  name: "LoginPage",
});

const router = useRouter();

const email = ref("");
const password = ref("");

const formData = ref({
  email: "",
  password: "",
});

const onForgotPassword = () => {
  alert("Lien de récupération de mot de passe (à implémenter)");
};

const handleSubmit = () => {
  console.log("Données de connexion:", email.value, password.value);
};
</script>

<template>
  <AuthLayout>
    <div
      class="bg-white border border-gray-100 rounded-2xl px-8 py-8 w-full max-w-md mx-auto"
    >
      <!-- En-tête avec logo et titre harmonisés -->
      <div class="flex flex-col items-center mb-6">
        <AppLogo />
        <div class="w-16 h-px bg-gray-200 my-4"></div>
        <h1 class="text-xl font-medium text-gray-700 tracking-wide">
          Connexion
        </h1>
      </div>

      <!-- Formulaire de connexion -->
      <div class="mb-5">
        <v-form class="flex flex-col gap-4">
          <v-text-field
            v-model="email"
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
            v-model="password"
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
          <div class="flex justify-end mb-1">
            <v-btn
              variant="text"
              size="small"
              color="primary"
              class="px-0 text-sm font-normal"
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
            class="rounded-2xl font-medium text-base py-3 mt-2"
            @click.prevent="handleSubmit"
          >
            <span class="normal-case">Se connecter</span>
          </v-btn>
        </v-form>
      </div>

      <!-- Séparateur minimaliste -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-100"></div>
        </div>
        <div class="relative flex justify-center">
          <span
            class="bg-white px-6 text-gray-400 text-xs font-medium tracking-wider uppercase"
            >ou</span
          >
        </div>
      </div>

      <!-- Section création de compte -->
      <div class="text-center">
        <p class="text-gray-500 text-sm font-normal mb-3">
          Nouveau sur Internis ?
        </p>
        <router-link to="/register">
          <v-btn
            variant="outlined"
            color="primary"
            class="w-full rounded-2xl font-medium"
            size="large"
          >
            <span class="normal-case">Créer un compte</span>
          </v-btn>
        </router-link>
      </div>
    </div>
  </AuthLayout>
</template>

<style scoped>
.flat-input .v-input__control {
  box-shadow: none !important;
  border-radius: 1rem;
  background: #fafbfc;
  border: 1px solid #f1f3f4;
  transition: all 0.3s ease;
}
.flat-input .v-input__control:hover {
  background: #f8f9fa;
  border-color: #e8eaed;
}
.flat-input .v-input__control:focus-within {
  border-color: #4285f4;
  background: #ffffff;
}
.flat-input .v-field__outline {
  border: none !important;
}
</style>
