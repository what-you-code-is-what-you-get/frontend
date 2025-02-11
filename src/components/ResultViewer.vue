<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
// Components
import ButtonComponent from './ButtonComponent.vue'
// Stores
import { useEditorStore } from '@/stores/editor'
// Init stores
const editorStore = useEditorStore()
// Variables
const showResult = ref<boolean>(false)

function show() {
  showResult.value = true
}

function close() {
  showResult.value = false
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
    <div v-if="showResult" class="results" :onClick="close">
      <div class="wrapper">
        <iframe class="content" :srcdoc="editorStore.value"></iframe>
        <ButtonComponent text="Close" color="green" @emitFunction="close" />
      </div>
    </div>
  </Transition>
  <ButtonComponent text="See Result" color="orange" @emitFunction="show" />
</template>
<style scoped>
.results {
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
    background-color: var(--color-bv-green);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .content {
      width: 100%;
      height: 100%;
      border: 8px solid var(--color-bv-blue);
      padding: 20px;
    }

    button {
      margin: 0;
    }
  }
}
</style>
