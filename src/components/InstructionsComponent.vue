<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
// Components
import ButtonComponent from './ButtonComponent.vue'
// Stores
import { useChallengeStore } from '@/stores/challenge'
// Init stores
const challengeStore = useChallengeStore()
// Emits
const emit = defineEmits(['close-instructions'])
// Variables
const APIURL: string = import.meta.env.VITE_API_URL
const firstTimeInstructions = ref<boolean>(true)
const showInstructions = ref<boolean>(true)

function show() {
  showInstructions.value = true
}

function close() {
  showInstructions.value = false
  if (firstTimeInstructions.value) {
    emit('close-instructions')
    firstTimeInstructions.value = false
  }
}

function escapeHandler(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (!firstTimeInstructions.value) {
      close()
    }
  }
}

defineExpose({
  show,
})

onBeforeMount(() => {
  document.addEventListener('keydown', escapeHandler)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', escapeHandler)
})
</script>

<template>
  <Transition>
    <div v-if="showInstructions" class="instructions">
      <div v-if="!firstTimeInstructions" class="blocker" :onClick="close"></div>
      <div class="wrapper">
        <div class="content">
          <div v-html="challengeStore.challenge?.field_instructions.processed" class="text"></div>
          <div class="assets">
            <h2>Assets</h2>
            <ul>
              <li v-for="asset in challengeStore.challenge?.field_assets" :key="asset.id">
                {{ asset.name }} - {{ APIURL + asset.thumbnail.uri.url }}
              </li>
            </ul>
          </div>
        </div>
        <ButtonComponent
          v-if="firstTimeInstructions"
          text="START"
          color="orange"
          @emitFunction="close"
        />
        <ButtonComponent
          v-if="!firstTimeInstructions"
          text="Close"
          color="green"
          @emitFunction="close"
        />
      </div>
    </div>
  </Transition>
  <ButtonComponent text="Instructions" color="blue" @emitFunction="show" />
</template>

<style scoped>
.instructions {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  .blocker {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    content: ' ';
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4);
  }

  .wrapper {
    background-color: var(--color-dark-gray);
    color: var(--color-text-color);
    margin: 3% auto; /* 15% from the top and centered */
    width: 60%; /* Could be more or less, depending on screen size */
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: 90%;
    .content {
      font-size: var(--step-0);
      padding: 20px 100px 20px;
      overflow-y: auto;
      .text {
        margin-bottom: 20px;
      }
      .assets {
        h2 {
          font-size: var(--step-2);
          margin-bottom: 10px;
        }
        ul {
          list-style-type: none;
          padding: 0;
          li {
            margin-bottom: 10px;
          }
        }
      }
    }
  }

  button {
    margin: 0;
  }
}
</style>
