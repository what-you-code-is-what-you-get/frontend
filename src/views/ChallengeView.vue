<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { client } from '@/utils/client.ts'
import type { Challenge } from '@/interfaces/Challenge'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
import IntroComponent from '@/components/IntroComponent.vue'
import { useChallengeStore } from '@/stores/challenge'
import { usePlayerStore } from '@/stores/player'

const route = useRoute()
const apiParams = new DrupalJsonApiParams()
const challengeStore = useChallengeStore()
const playerStore = usePlayerStore()

const errorMsg = ref<string | null>(null)
const loading = ref<boolean>(false)

async function getChallengeById(id: string) {
  const queryString = apiParams
    .addInclude(['field_reference_image.thumbnail', 'field_game_mode.vid'])
    .getQueryString()

  try {
    const respons = await client.getResource('node--challenge', id, {
      queryString: queryString,
    })

    if (respons) {
      console.log('respons', respons)

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
        <div class="iconName-Wrapper">
          <!-- <img v-if="challenge.practice" src="../assets/images/figur1.svg" alt="Figur" class="figur1" />-->
          <img src="../assets/images/figur2.svg" alt="Figur" class="figur2" />
          <h1>{{ challengeStore.challenge?.title }}</h1>
        </div>
      </header>
    </div>
  </main>
</template>
<style scoped>
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
</style>
