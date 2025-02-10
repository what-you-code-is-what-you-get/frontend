<script setup lang="ts">
import { watch, ref } from 'vue'
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
})

const bump = ref(false)

watch(
  () => props.value,
  () => {
    bump.value = true
    setTimeout(() => {
      bump.value = false
    }, 250)
  },
)
</script>

<template>
  <div class="combo">
    <p class="label">Combo</p>
    <p :class="{ bump: bump, value: true }">{{ value }}</p>
  </div>
</template>

<style scoped>
.combo {
  color: var(--color-bv-green);
  font-family: 'Press Start 2P', cursive;
  padding-right: 50px;
  position: absolute;
  right: 0;
  text-align: center;
  top: 120px;
  .label {
    font-weight: 700;
    margin: 0;
    padding-bottom: 5px;
  }
  .value {
    font-size: 62px;
    line-height: 1.2;
  }
  .bump {
    animation: grow 0.25s both;
  }

  @keyframes grow {
    0% {
      animation-timing-function: ease-out;
    }
    50% {
      transform: scale(1.3);
      animation-timing-function: ease-in;
    }
  }
}
</style>
