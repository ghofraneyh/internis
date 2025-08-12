<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from 'vue-router'
import AppLogo from "@/components/Logo.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import { useAuth } from "@/composables/useAuth";

defineOptions({
  name: "LoginPage",
});

const router = useRouter()
const { signIn, resetPassword, loading, initAuth } = useAuth()

const email = ref("");
const password = ref("");
const showForgotPassword = ref(false);
const forgotEmail = ref("");

// Messages d'erreur et de succès
const errorMessage = ref("");
const successMessage = ref("");

// Validation simple
const isFormValid = computed(() => {
  return email.value.trim() !== "" && 
         password.value.trim() !== "" && 
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

const onForgotPassword = () => {
  showForgotPassword.value = true;
  errorMessage.value = "";
  successMessage.value = "";
};

const closeForgotPassword = () => {
  showForgotPassword.value = false;
  forgotEmail.value = "";
  errorMessage.value = "";
  successMessage.value = "";
};

const handleForgotPassword = async () => {
  if (!forgotEmail.value.trim()) {
    errorMessage.value = "Veuillez saisir votre adresse email";
    return;
  }

  const result = await resetPassword(forgotEmail.value);
  
  if (result.success) {
    successMessage.value = `Un lien de récupération a été envoyé à : ${forgotEmail.value}`;
    setTimeout(() => {
      closeForgotPassword();
    }, 2000);
  } else {
    errorMessage.value = result.error || "Erreur lors de l'envoi de l'email";
  }
};

const handleSubmit = async () => {
  // Reset des messages
  errorMessage.value = "";
  successMessage.value = "";

  // Validation
  if (!isFormValid.value) {
    errorMessage.value = "Veuillez remplir correctement tous les champs";
    return;
  }

  // Tentative de connexion
  const result = await signIn(email.value, password.value);
  
  if (result.success) {
    successMessage.value = "Connexion réussie ! Redirection...";
    
    // Redirection après un court délai
    setTimeout(() => {
      router.push('/dashboard'); // ⚠️ REMPLACE par ta route de destination
    }, 1000);
  } else {
    // Gestion des erreurs spécifiques
    switch (result.error) {
      case 'Invalid login credentials':
        errorMessage.value = "Email ou mot de passe incorrect";
        break;
      case 'Email not confirmed':
        errorMessage.value = "Veuillez confirmer votre email avant de vous connecter";
        break;
      default:
        errorMessage.value = result.error || "Erreur de connexion";
    }
  }
};

// Initialisation de l'authentification au montage du composant
onMounted(() => {
  initAuth();
});
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

      <!-- Messages d'erreur et de succès -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm">{{ errorMessage }}</p>
      </div>
      
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-600 text-sm">{{ successMessage }}</p>
      </div>

      <!-- Formulaire de connexion -->
      <div class="mb-5">
        <v-form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
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
            :disabled="loading"
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
            :disabled="loading"
          />
          <div class="flex justify-end mb-1">
            <v-btn
              variant="text"
              size="small"
              color="primary"
              class="px-0 text-sm font-normal"
              @click="onForgotPassword"
              :disabled="loading"
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
            :loading="loading"
            :disabled="!isFormValid || loading"
          >
            <span class="normal-case">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </span>
          </v-btn>
        </v-form>
      </div>
    </div>

    <!-- Modal Mot de passe oublié -->
    <div v-if="showForgotPassword" class="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div class="bg-white border border-gray-100 rounded-2xl px-8 py-8 w-full max-w-md mx-auto relative">
        <button @click="closeForgotPassword" class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        
        <!-- En-tête -->
        <div class="flex flex-col items-center mb-6">
          <AppLogo />
          <div class="w-16 h-px bg-gray-200 my-4"></div>
          <h1 class="text-xl font-medium text-gray-700 tracking-wide">
            Mot de passe oublié
          </h1>
        </div>

        <!-- Messages dans la modal -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">{{ errorMessage }}</p>
        </div>
        
        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-600 text-sm">{{ successMessage }}</p>
        </div>
        
        <!-- Formulaire de récupération -->
        <div class="mb-5">
          <v-form class="flex flex-col gap-4" @submit.prevent="handleForgotPassword">
            <v-text-field
              v-model="forgotEmail"
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
              :disabled="loading"
            />
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              variant="flat"
              class="rounded-2xl font-medium text-base py-3 mt-2"
              :loading="loading"
              :disabled="loading"
            >
              <span class="normal-case">
                {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
              </span>
            </v-btn>
          </v-form>
        </div>
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
