<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
// @ts-expect-error: GridLoader does not have TypeScript definitions
import GridLoader from 'vue-spinner/src/GridLoader.vue'
// Utils
import { client } from '@/utils/client.ts'
// Interfaces
import type { Challenge } from '@/interfaces/Challenge'
import type { SubmissionArray } from '@/interfaces/SubmissionArray'
// Components
import ButtonComponent from '@/components/ButtonComponent.vue'
// Stores
import { useChallengeStore } from '@/stores/challenge'
// Init
const challengeStore = useChallengeStore()
const route = useRoute()

// Variables
const challengeId = ref<string | null>(null)
const errorMsg = ref<string | null>(null)
const loading = ref<boolean>(false)
const voted = ref<boolean>(false)
const color = '#79fe9d'
const size = '25px'
const submissionArray = ref<SubmissionArray>([])
const localStorageName = 'votedChallenge' + challengeId.value

/* const emit = defineEmits(["submit"]); */

async function getChallengeById(id: string) {
  loading.value = true

  try {
    const respons = await client.getResource('node--challenge', id)

    if (respons) {
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

async function getSubmissionsById(id: string) {
  const apiParams = new DrupalJsonApiParams()
  loading.value = true
  const submissionQueryString = apiParams.addFilter('field_challenge_id', id, '=').getQueryString()
  try {
    const respons = await client.getCollection('node--submission', {
      queryString: submissionQueryString,
    })

    if (respons) {
      submissionArray.value = respons as SubmissionArray
    } else {
      errorMsg.value = 'Found no challenge with that Game pin'
    }
  } catch (error) {
    console.error('error', error)
  } finally {
    loading.value = false
  }
}

async function init() {
  challengeId.value = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  await getChallengeById(challengeId.value)
  await getSubmissionsById(challengeStore.challenge!.drupal_internal__nid.toString())
}

onMounted(() => {
  init()
  voted.value = localStorage.getItem(localStorageName) === 'true'
})

async function vote(vote_id: string) {
  try {
    const responseBody = await client.createResource(
      'node--vote',
      {
        data: {
          type: 'node--vote',
          attributes: {
            title: `vote-${challengeStore.challenge?.title}`,
            field_challenge_id: challengeStore.challenge?.drupal_internal__nid,
            field_submission_id: vote_id,
          },
        },
      },
      { rawResponse: false },
    )

    if (responseBody) {
      localStorage.setItem(localStorageName, true.toString())
      router.push({
        name: 'vote',
      })
    } else {
      throw new Error('Failed to vote.')
    }
  } catch (error) {
    console.error('error', error)
  }
}
</script>
<template>
  <header>
    <router-link to="/vote">Back</router-link>
    <h1>{{ challengeStore.challenge?.title }}</h1>
  </header>
  <div v-if="loading">
    <grid-loader :loading="loading" :color="color" :size="size"> </grid-loader>
  </div>
  <div class="wrapper" v-if="!voted">
    <template v-for="submission in submissionArray" :key="submission.uid.id">
      <ButtonComponent
        :text="submission.drupal_internal__nid.toString()"
        color="orange"
        @emitFunction="vote(submission.drupal_internal__nid.toString())"
      />
    </template>
  </div>

  <div class="banner" v-if="voted">
    <h2>You have already voted.</h2>
  </div>
</template>
<style scoped>
header {
  align-items: center;
  background-color: var(--color-dark-gray);
  color: var(--color-bv-green);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px;
  @media only screen and (min-width: 600px) {
    flex-direction: row;
  }
  a {
    color: var(--color-bv-green);
    font-weight: 500;
    font-size: 32px;
    line-height: 42px;
    padding: 15px 30px;

    &:hover,
    &:focus {
      background-color: var(--color-bv-green)-hover-bg;
      text-decoration: underline;
    }

    &:active {
      background-color: var(--color-bv-green);
      color: var(--color-dark-gray);
    }
  }
}
.wrapper {
  position: relative;
  margin: 20px 20px 60px 20px;
  font-size: 28px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media only screen and (min-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
}

button {
  margin: 0;
}

.banner {
  display: flex;
  justify-content: center;
  padding: 20px;
  h2 {
    font-size: var(--step-3);
    color: var(--color-bv-orange);
    text-align: center;
  }
}
</style>
