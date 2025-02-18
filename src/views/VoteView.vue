<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'
// Utils
import { client } from '@/utils/client.ts'
// Components
import ButtonComponent from '@/components/ButtonComponent.vue'
import LargeLogoComponent from '@/components/LargeLogoComponent.vue'
// Variables
const gamePin = ref<string | null>(null)
const errorMsg = ref<string | null>(null)
const loading = ref<boolean>(false)

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
        if (challenge) {
          router.push({
            name: 'Vote challenge',
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
  <div class="">
    <LargeLogoComponent />

    <div class="flex">
      <div class="wrapper">
        <label for="GamePin">Game pin</label>
        <input type="text" placeholder="000000" name="Game pin" v-model="gamePin" autofocus />
        <span class="errorMsg" v-if="errorMsg">{{ errorMsg }}</span>

        <ButtonComponent text="Enter" color="orange" @emitFunction="findChallengeId" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.logo-wrapper {
  display: flex;
  padding: 80px 25px;
  justify-content: center;

  @media only screen and (min-width: 600px) {
    padding-top: 200px;
    padding-bottom: 100px;
  }
}

.flex {
  display: flex;
  justify-content: center;
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
</style>
