<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { client } from '@/utils/client.ts'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

import ButtonComponent from '@/components/ButtonComponent.vue'

const gamePin = ref<string | null>(null)
const errorMsg = ref<string | null>(null)
const loading = ref<boolean>(false)

async function findChallengeId() {
  if (gamePin.value) {
    loading.value = true
    try {
      /*  const challenge = await client.getResource(
        'node--challenge',
        '907958bb-4344-4e80-b28c-839b3b626c3e',
        { queryString: 'include=field_reference_image.thumbnail' },
      ) */
      const apiParams = new DrupalJsonApiParams()
      const queryString = apiParams
        .addFilter('field_game_pin', gamePin.value, '=')
        .addFields('node--challenge', ['id'])
        .getQueryString()
      const challenge: any = await client.getCollection('node--challenge', {
        queryString: queryString,
      })

      if (challenge.length > 0) {
        if (challenge) {
          router.push({
            name: 'Challenge',
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
</script>

<template>
  <main>
    <div class="logo-wrapper">
      <img src="@/assets/images/logo.svg" alt="WYCIWYG - What you code is what you get" />
    </div>

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
        <!-- TODO: add remember Game pin checkbox and save to localstorage and retrive and autofill if  -->
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
</style>
