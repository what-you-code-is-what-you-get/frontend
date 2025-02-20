<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from 'vue'
import router from '@/router'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
// Utils
import { client } from '@/utils/client.ts'
// Stores
import { useChallengeStore } from '@/stores/challenge'
import { usePlayerStore } from '@/stores/player'
import { useEditorStore } from '@/stores/editor'
// Components
import ButtonComponent from '@/components/ButtonComponent.vue'
import LargeLogoComponent from '@/components/LargeLogoComponent.vue'
// Interfaces
//import type { ChallengeArray } from '@/interfaces/ChallengeArray'
// Init stores
const challengeStore = useChallengeStore()
const playerStore = usePlayerStore()
const editorStore = useEditorStore()
// Variables
const gamePin = ref<string | null>(null)
const errorMsg = ref<string | null>(null)
const loading = ref<boolean>(false)
const rememberGamePin = ref<boolean>(false)

async function findChallengeId() {
  if (gamePin.value) {
    loading.value = true
    try {
      const apiParams = new DrupalJsonApiParams()
      const queryString = apiParams
        .addFilter('field_game_pin', gamePin.value, '=')
        .addFields('node--challenge', ['id'])
        .getQueryString()
      const challenge: any = await client.getCollection('node--challenge', {
        queryString: queryString,
      })

      if (challenge.length > 0) {
        if (rememberGamePin.value) {
          localStorage.setItem('gamePin', gamePin.value)
        } else {
          localStorage.removeItem('gamePin')
        }
        if (challenge) {
          router.push({
            name: 'challenge',
            params: { id: challenge[0].id },
          })
        }
      } else {
        errorMsg.value = 'Found no challenge with that Game pin'
      }
    } catch (error) {
      console.error('error', error)
    } finally {
      loading.value = false
    }
  }
}
onBeforeMount(() => {
  challengeStore.$reset()
  playerStore.$reset()
  editorStore.$reset()
})

onMounted(() => {
  if (localStorage.getItem('gamePin')) {
    gamePin.value = localStorage.getItem('gamePin')
    rememberGamePin.value = true
  }
})
</script>

<template>
  <main>
    <LargeLogoComponent />

    <div class="flex">
      <div class="info">
        <h1>
          Type in the Game Pin you see on the big screen or if you want to practice type in
          <span>PRACTICE</span>.
        </h1>
      </div>
      <div class="wrapper">
        <label for="GamePin">Game pin</label>
        <input type="text" placeholder="000000" name="Game pin" v-model="gamePin" autofocus />
        <label class="container rememberGamePin">
          <p>Remember Game pin</p>
          <input type="checkbox" id="checkbox" v-model="rememberGamePin" required />
          <span class="checkmark"></span>
        </label>
        <div v-if="loading" class="loading">Loading...</div>
        <span class="errorMsg" v-if="errorMsg">{{ errorMsg }}</span>

        <ButtonComponent text="Enter" color="orange" @emitFunction="findChallengeId" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.logo-wrapper {
  display: flex;
  padding-top: 200px;
  padding-bottom: 100px;
  justify-content: center;
}
.info {
  max-width: 800px;
  margin-bottom: 30px;
}
h1 {
  font-size: 28px;
}

h1 span {
  color: var(--color-bv-green);
}
.flex {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.wrapper {
  margin: 20px;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin-bottom: 40px;
}

input[type='text'] {
  background: var(--color-dark-gray);
  border: 2px solid var(--color-bv-orange);
  padding: 20px;
  width: 100%;
  color: var(--color-bv-green);
  font-size: 75px;
  line-height: 1;

  &::placeholder {
    color: #494949;
  }
}

.errorMsg {
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 20px;
}

label {
  font-size: 20px;
  line-height: 28px;
  color: var(--color-text-color);
  margin-bottom: 10px;
}

.loading {
  font-size: var(--step-2);
  color: var(--color-bv-green);
}

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-top: 10px;
  margin-bottom: 30px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border: 2px solid var(--color-bv-orange);
}

.privacy-policy .checkmark {
  top: 10px;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: var(--color-bv-orange);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
