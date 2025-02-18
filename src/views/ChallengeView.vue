<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onBeforeMount, ref, computed } from 'vue'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
// Utils
import { client } from '@/utils/client.ts'
// Interfaces
import type { Challenge } from '@/interfaces/Challenge'
// Components
import IntroComponent from '@/components/IntroComponent.vue'
import Reference from '@/components/ReferenceComponent.vue'
import Instructions from '@/components/InstructionsComponent.vue'
import MonacoEditor from '@/components/MonacoEditor.vue'
import Combo from '@/components/ComboComponent.vue'
import ResultViewer from '@/components/ResultViewer.vue'
import FinishedConfirmation from '@/components/FinishedConfirmation.vue'
// Stores
import { useChallengeStore } from '@/stores/challenge'
import { usePlayerStore } from '@/stores/player'

const route = useRoute()
// Init stores
const challengeStore = useChallengeStore()
const playerStore = usePlayerStore()
// Variables
const errorMsg = ref<string | null>(null)
const loading = ref<boolean>(false)
const finishedTimer = ref<boolean>(false)
const timeLeft = ref<number>(0)
const combo = ref<number>(0)
const comboTimer = ref<number>(0)
import type FinishedConfirmationComponent from '@/components/FinishedConfirmation.vue'
const finishedConfirmation = ref<InstanceType<typeof FinishedConfirmationComponent> | null>(null)

const formattedTime = computed(() => {
  if (timeLeft.value < 60) {
    return timeLeft.value
  } else {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
})

const startTimer = () => {
  timeLeft.value = (challengeStore.challenge?.field_time || 0) * 60
  countdown()
}

const countdown = () => {
  if (finishedTimer.value) return

  if (timeLeft.value > 0) {
    setTimeout(() => {
      timeLeft.value--
      countdown()
    }, 1000)
  } else {
    timeUp()
  }
}

const isPulsating = computed(() => timeLeft.value < 30)

const timeUp = () => {
  console.log('Time is up!')
  if (finishedConfirmation.value && finishedConfirmation.value.showResult) {
    finishedConfirmation.value.showResult()
  }
}

const stopTimer = () => {
  finishedTimer.value = true
}

const comboUpdate = () => {
  combo.value++
  clearTimeout(comboTimer.value)
  comboTimer.value = setTimeout(() => {
    combo.value = 0
  }, 10000)
}

async function getChallengeById(id: string) {
  const apiParams = new DrupalJsonApiParams()
  const queryString = apiParams
    .addInclude([
      'field_reference_image.thumbnail',
      'field_game_mode.vid',
      'field_assets.thumbnail',
    ])
    .getQueryString()

  try {
    const respons = await client.getResource('node--challenge', id, {
      queryString: queryString,
    })

    if (respons) {
      /* console.log('respons', respons) */

      challengeStore.setChallenge(respons as Challenge)
    } else {
      errorMsg.value = 'Found no challenge with that Game pin'
    }
  } catch (error) {
    console.error('error', error)
  } finally {
    loading.value = false
  }
}

onBeforeMount(() => {
  const challengeId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  getChallengeById(challengeId)
})
</script>
<template>
  <main>
    <div v-if="!playerStore.name">
      <IntroComponent />
    </div>
    <div v-else>
      <header>
        <router-link to="/">Back</router-link>
        <div
          v-if="challengeStore.challenge?.field_game_mode.name === 'Conference mode'"
          class="timer"
        >
          <span>Time left:</span>
          <span :class="['time', { pulsating: isPulsating }]">{{ formattedTime }}</span>
        </div>
        <div class="iconName-Wrapper">
          <img
            v-if="challengeStore.challenge?.field_game_pin === 'PRACTICE'"
            src="../assets/images/figur1.svg"
            alt="Figur"
            class="figur1"
          />
          <img v-else src="../assets/images/figur2.svg" alt="Figur" class="figur2" />
          <h1>{{ challengeStore.challenge?.title }}</h1>
        </div>
      </header>
      <div class="wrapper">
        <MonacoEditor @combo-update="comboUpdate" />
      </div>

      <div class="name">
        {{ playerStore.name }}
      </div>
      <div class="button-container">
        <Reference />
        <Instructions ref="instructions" @close-instructions="startTimer" />
        <ResultViewer v-if="challengeStore.challenge?.field_game_pin === 'PRACTICE'" />
        <FinishedConfirmation
          ref="finishedConfirmation"
          v-if="challengeStore.challenge?.field_game_pin !== 'PRACTICE'"
          @stop-timer="stopTimer"
        />
      </div>
      <Combo :value="combo" />
    </div>
  </main>
</template>
<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
  color: var(--color-bv-green);
  a {
    color: var(--color-bv-green);
    font-weight: 500;
    font-size: 32px;
    line-height: 42px;
    padding: 15px 30px;

    &:hover,
    &:focus {
      background-color: var(--color-bv-green-hover-bg);
      text-decoration: underline;
    }

    &:active {
      background-color: var(--color-bv-green);
      color: var(--color-dark-gray);
    }
  }

  .timer {
    display: flex;
    gap: 10px;
    align-items: center;
    span {
      font-weight: 700;
      font-size: 22px;
      line-height: 32px;
    }
    .time {
      font-weight: 700;
      font-size: 3em;
      transition: font-size 0.5s ease;
    }
    .pulsating {
      font-size: 3.5em;
      color: var(--color-bv-orange);
      animation: pulse 1s infinite;
    }
  }

  .iconName-Wrapper {
    display: flex;

    .figur1 {
      width: 40px;
    }

    .figur2 {
      width: 50px;
    }

    h1 {
      font-weight: 700;
      font-size: 50px;
      line-height: 66px;
      margin-left: 20px;
    }
  }
}

.wrapper {
  display: flex;
}

.name {
  background-color: var(--color-bv-blue);
  bottom: 0;
  color: var(--color-bv-green);
  font-weight: 700;
  font-size: 40px;
  line-height: 53px;
  padding: 25px 70px;
  position: absolute;
  margin: 20px;
}

.button-container {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 30px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}
</style>
