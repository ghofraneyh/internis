import { ref, computed, readonly } from 'vue'
import { supabase } from './useSupabase'
import type { User, Session } from '@supabase/supabase-js'
import { useUserStore } from '@/stores/user'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(false)

export const useAuth = () => {
  // Store utilisateur Pinia
  const userStore = useUserStore()

  // État de connexion
  const isLoggedIn = computed(() => !!user.value)

  // Fonction de connexion
  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      user.value = data.user
      session.value = data.session
      // Stocker dans Pinia
      if (data.user) {
        userStore.setUser({ id: data.user.id, email: data.user.email ?? '' })
      }
      
      return { success: true, user: data.user }
    } catch (error: unknown) {
      const err = error as { message: string }
      console.error('Erreur de connexion:', err.message)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      loading.value = true
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }

      user.value = null
      session.value = null
      // Réinitialiser le store Pinia
      userStore.resetUser()
      
      return { success: true }
    } catch (error: unknown) {
      const err = error as { message: string }
      console.error('Erreur de déconnexion:', err.message)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Récupération de l'utilisateur actuel
  const getCurrentUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
      return currentUser
    } catch (error: unknown) {
      const err = error as { message: string }
      console.error('Erreur récupération utilisateur:', err.message)
      return null
    }
  }

  // Réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    try {
      loading.value = true
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      return { success: true }
    } catch (error: unknown) {
      const err = error as { message: string }
      console.error('Erreur reset password:', err.message)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Écouter les changements d'authentification
  const initAuth = () => {
    supabase.auth.onAuthStateChange((event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user ?? null
      
      if (event === 'SIGNED_IN') {
        console.log('Utilisateur connecté:', user.value?.email)
      } else if (event === 'SIGNED_OUT') {
        console.log('Utilisateur déconnecté')
      }
    })
  }

  return {
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    isLoggedIn,
    signIn,
    signOut,
    getCurrentUser,
    resetPassword,
    initAuth
  }
}