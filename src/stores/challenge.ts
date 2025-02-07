import { defineStore } from 'pinia'
import type { Challenge } from '@/interfaces/Challenge'

interface State {
  challenge: Challenge | null
}

export const useChallengeStore = defineStore('challenge', {
  state: (): State => {
    return {
      challenge: null,
    }
  },
  actions: {
    setChallenge(challenge: Challenge) {
      this.challenge = challenge
    },
  },
})
