import { defineStore } from 'pinia'

interface State {
  name: string
  email: string
  phoneNumber: string
  personvernerklaering: boolean
}

export const usePlayerStore = defineStore('player', {
  state: (): State => {
    return {
      name: '',
      email: '',
      phoneNumber: '',
      personvernerklaering: false,
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
    setPersonvernerklaering(personvernerklaering: boolean) {
      this.personvernerklaering = personvernerklaering
    },
  },
})
