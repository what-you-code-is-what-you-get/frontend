<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
// Stores
import { useChallengeStore } from '@/stores/challenge'

// Init stores
const challengeStore = useChallengeStore()
// Variables
const imageUrl =
  import.meta.env.VITE_API_URL + challengeStore.challenge?.field_reference_image.thumbnail.uri.url
const showReference = ref<boolean>(false)

function show() {
  showReference.value = true
}

function close() {
  showReference.value = false
}

function escapeHandler(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

onBeforeMount(() => {
  document.addEventListener('keydown', escapeHandler)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', escapeHandler)
})
</script>

<template>
  <Transition>
    <div v-if="showReference" class="reference" :onClick="close">
      <div class="wrapper">
        <span class="close" :onClick="close">Close</span>
        <div class="content">
          <img :src="imageUrl" alt="Reference image" />
        </div>
      </div>
    </div>
  </Transition>
  <img class="smallReference" :onclick="show" :src="imageUrl" alt="Reference image" />
</template>

<style scoped>
.reference {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  .wrapper {
    background-color: var(--color-bv-light-bg);
    color: var(--color-text-color-dark);
    margin: 2% auto;
    width: 95%; /* Could be more or less, depending on screen size */
    display: flex;
    flex-direction: column;

    .content {
      white-space: pre-line;
    }

    /* The Close Button */
    .close {
      align-self: end;
      color: var(--color-text-color-dark);
      cursor: pointer;
      font-weight: 700;
      font-size: 20px;
      line-height: 26px;
      margin-top: 5px;
      margin-bottom: 5px;
      margin-right: 20px;
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
    }
  }
}

.smallReference {
  width: 100%;
  height: 250px;
  grid-column-start: 1;
  grid-column-end: 3;
  border: 2px solid #3480eb;
  cursor: pointer;
}
</style>
