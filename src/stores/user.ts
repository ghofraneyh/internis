import { defineStore } from 'pinia'

interface UserInfo {
  id: string | null
  email: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserInfo => ({
    id: null,
    email: null,
  }),
  actions: {
    setUser(user: { id: string; email: string }) {
      this.id = user.id
      this.email = user.email
    },
    resetUser() {
      this.id = null
      this.email = null
    },
  },
}) 