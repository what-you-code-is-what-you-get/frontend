import { defineStore } from 'pinia'

interface State {
  name: string
  email: string
  phoneNumber: string
  privacyPolicy: boolean
}

export const usePlayerStore = defineStore('player', {
  state: (): State => {
    return {
      name: '',
      email: '',
      phoneNumber: '',
      privacyPolicy: false,
    }
  },
  actions: {
    setName(name: string) {
      this.name = name
    },
    setEmail(email: string) {
      this.email = email
    },
    setPhoneNumber(phoneNumber: string) {
      this.phoneNumber = phoneNumber
    },
    setprivacyPolicy(privacyPolicy: boolean) {
      this.privacyPolicy = privacyPolicy
    },
  },
})
