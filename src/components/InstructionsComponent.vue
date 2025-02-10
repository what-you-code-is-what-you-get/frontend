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
const APIURL = import.meta.env.VITE_API_URL
const firstTimeInstructions = ref<boolean>(false)
const instructionsContainer = ref<HTMLElement | null>(null)

function show() {
  if (instructionsContainer.value) {
    instructionsContainer.value.style.display = 'block'
  }
}

function close() {
  if (instructionsContainer.value) {
    instructionsContainer.value.style.display = 'none'
  }
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
  <div ref="instructionsContainer" class="instructions">
    <div v-if="!firstTimeInstructions" class="blocker" :onClick="close"></div>
    <div class="wrapper">
      <!-- <span v-if="!firstTimeInstructions" class="close" :onClick="close">Close</span> -->

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
      overflow-y: scroll;
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

    /* The Close Button */
    /*   .close {
      align-self: end;
      color: var(--color-bv-green);
      cursor: pointer;
      font-weight: 700;
      font-size: 20px;
      line-height: 26px;
      margin-top: 35px;
      margin-right: 55px;
      padding: 10px 15px;

      &:hover,
      &:focus {
        background-color: rgba(30, 30, 30, 0.1);
        text-decoration: underline;
      }

      &:active {
        background-color: var(--color-text-color-dark);
        color: var(--color-bv-citrine-white);
      }
    } */
  }

  button {
    margin: 0;
  }
}

/* button {
  background-color: var(--color-bv-blue);
  color: var(--color-bv-green);
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  border: 2px solid var(--color-bv-blue);

  &:hover {
    background: linear-gradient(0deg, rgba(121, 254, 157, 0.2), rgba(121, 254, 157, 0.2)),
      var(--color-bv-blue);
  }

  &:active {
    background-color: var(--color-bv-green);
    color: var(--color-bv-blue);
    border: 2px solid var(--color-bv-blue);
  }
}

button.start {
  background-color: var(--color-bv-orange);
  color: var(--color-text-color-dark);
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  border: 2px solid var(--color-bv-orange);

  &:hover {
    background-color: var(--color-bv-dark-orange);
  }

  &:active {
    background-color: var(--color-text-color-dark);
    color: var(--color-bv-orange);
    border: 2px solid var(--color-bv-orange);
  }
} */
</style>
