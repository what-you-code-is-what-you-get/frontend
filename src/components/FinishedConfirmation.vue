<script setup lang="ts">
import { ref } from 'vue'
// @ts-expect-error: GridLoader does not have TypeScript definitions
import GridLoader from 'vue-spinner/src/GridLoader.vue'
import { useRouter } from 'vue-router'
// Utils
import { client } from '@/utils/client.ts'
// Stores
import { useEditorStore } from '@/stores/editor'
import { useChallengeStore } from '@/stores/challenge'
import { usePlayerStore } from '@/stores/player'
// Components
import ButtonComponent from './ButtonComponent.vue'

const emit = defineEmits(['stop-timer'])

const router = useRouter()
// Init stores
const editorStore = useEditorStore()
const challengeStore = useChallengeStore()
const playerStore = usePlayerStore()

// Variables
const errorMsg = ref<string | null>(null)
const showConfirmationWindow = ref<boolean>(false)
const showResultContainer = ref<boolean>(false)
const savedDataToDB = ref<boolean>(false)
const score = ref<number>(0)
const loadingScore = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const imageUrl =
  import.meta.env.VITE_API_URL + challengeStore.challenge?.field_reference_image.thumbnail.uri.url
const color = '#79fe9d'
const size = '25px'

function showConfirmation() {
  showConfirmationWindow.value = true
}

async function showResult() {
  isLoading.value = true
  if (challengeStore.challenge?.field_game_mode.name === 'Conference mode') {
    emit('stop-timer')
    showResultContainer.value = true
  }
  await getScore()
  savedDataToDB.value = await save()
  if (savedDataToDB.value) {
    showConfirmationWindow.value = false
    errorMsg.value = null
    if (challengeStore.challenge?.field_game_mode.name === 'Multiplayer mode') {
      reset()
    }
  } else {
    showConfirmationWindow.value = true
  }
}

function close() {
  showConfirmationWindow.value = false
  showResultContainer.value = false
}

async function reset() {
  close()
  router.push({
    name: 'home',
  })
}

async function getScore() {
  const data = {
    code: editorStore.value,
    reference: imageUrl,
  }
  await fetchData('https://imagecompare.prototyp.io/api/wyciwyg', data)
    .then((data) => {
      score.value = data.score
      loadingScore.value = false
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

async function save() {
  try {
    const responseBody = await client.createResource(
      'node--submission',
      {
        data: {
          type: 'node--submission',
          attributes: {
            title: `submission-${challengeStore.challenge?.title}`,
            field_challenge_id: challengeStore.challenge?.drupal_internal__nid,
            field_code: editorStore.value,
            field_email: playerStore.email,
            field_name: playerStore.name,
            field_phone: playerStore.phoneNumber,
            field_personvernerklaering: playerStore.privacyPolicy,
            field_score: score.value,
          },
        },
      },
      { rawResponse: false },
    )

    if (responseBody) {
      return true
    } else {
      throw new Error('Failed to save the submission.')
    }
  } catch (error) {
    console.error('Save submission error:', error)
    errorMsg.value = (error as Error).message
    return false
  } finally {
    isLoading.value = false
  }
}

interface FetchDataResponse {
  score: number
}

interface FetchData {
  code: string
  reference: string
}

const fetchData = async (url: string, data: FetchData): Promise<FetchDataResponse> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      console.log(response)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const result: FetchDataResponse = await response.json()
    return result
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

defineExpose({
  showResult,
})
</script>
<template>
  <div v-if="showConfirmationWindow" class="instructions">
    <div ref="wrapper" class="wrapper">
      <p>This will send in your code and wipe the editor clean.</p>
      <p>Are you sure you want to do this?</p>
      <span class="errorMsg" v-if="errorMsg">{{ errorMsg }}</span>
      <div v-if="isLoading" class="loading">
        <grid-loader :loading="isLoading" :color="color" :size="size"> </grid-loader>
      </div>
      <div class="buttons">
        <ButtonComponent text="Cancel" color="orange" @emitFunction="close" />
        <ButtonComponent text="Yes!" color="orange" @emitFunction="showResult" />
      </div>
    </div>
  </div>
  <div v-if="showResultContainer" class="result">
    <div class="resultWrapper">
      <div class="comparison">
        <div>
          <h2>Orginal</h2>
          <img :src="imageUrl" alt="Reference image" />
        </div>
        <div>
          <h2>Din kode</h2>
          <div class="iframe">
            <iframe :srcdoc="editorStore.value"></iframe>
          </div>
        </div>
      </div>
      <div class="score">
        <h2>Score</h2>
        <div v-if="loadingScore">
          <grid-loader :loading="loadingScore" :color="color" :size="size"> </grid-loader>
        </div>

        <span v-else>{{ score }}/100</span>
      </div>
      <ButtonComponent text="Restart" color="orange" @emitFunction="reset" />
    </div>
  </div>
  <ButtonComponent text="Finish!" color="orange" @emitFunction="showConfirmation" />
</template>
<style scoped>
.instructions,
.result {
  display: flex;
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .wrapper {
    background-color: var(--color-dark-gray-plus1);
    color: var(--color-text-color);
    padding: 50px;
    border: 1px solid var(--color-bv-blue);
    width: 600px;
    position: relative;

    p {
      font-size: 24px;
      line-height: 34px;
      text-align: center;
      margin-bottom: 40px;
    }
  }

  .resultWrapper {
    width: 95%;
    background-color: var(--color-dark-gray-plus1);
    color: var(--color-text-color);
    border: 1px solid var(--color-bv-blue);
    position: relative;
    padding-top: 40px;

    .comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;

      .iframe {
        position: relative;
        width: auto;
        height: 540px;
        overflow: hidden;
        background-color: white;
        iframe {
          border: 0;
          scale: 0.5;
          position: absolute;
          width: 1920px;
          height: 1080px;
          transform-origin: top left;
          top: 0px;
          left: 0px;
        }
      }
    }

    .score {
      width: 100%;
      margin-top: 40px;
      margin-bottom: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;

      h2 {
        font-weight: 700;
        font-size: 50px;
        line-height: 66px;
        margin-bottom: 10px;
        color: var(--color-bv-orange);
      }
      span {
        font-weight: 700;
        font-size: 150px;
        line-height: 156px;
        color: var(--color-bv-green);
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    gap: 25px;
  }
  button {
    margin: 0;
  }
}

.errorMsg {
  color: var(--color-bv-green);
  display: block;
  font-size: var(--step-1);
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: center;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
