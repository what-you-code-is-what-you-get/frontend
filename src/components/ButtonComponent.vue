<script setup lang="ts">
defineProps<{
  text: string
  color: string
}>()
defineEmits(['emitFunction'])
</script>

<template>
  <button @click="$emit('emitFunction')" :class="color">{{ text }}</button>
</template>

<style scoped>
button {
  color: var(--color-text-color-dark);
  display: flex;
  font-size: var(--step-2);
  justify-content: center;
  padding: 20px 0;
  width: 100%;
  border: 6px solid var(--dark-gray);
  transition: 0.5s;
  cursor: pointer;
  margin: 20px 0;

  &.orange {
    background-color: var(--color-bv-orange);
    border: 6px solid var(--color-bv-orange);

    &:hover,
    &:focus {
      background-color: var(--color-dark-gray);
      color: var(--color-bv-orange);
      border: 6px solid var(--color-bv-orange);
    }
  }

  &.green {
    background-color: var(--color-bv-green);
    border: 6px solid var(--color-bv-green);

    &:hover,
    &:focus {
      background-color: var(--color-dark-gray);
      color: var(--color-bv-green);
      border: 6px solid var(--color-bv-green);
    }
  }

  &.blue {
    background-color: var(--color-bv-blue);
    border: 6px solid var(--color-bv-blue);
    color: var(--color-text-color);
    &:hover,
    &:focus {
      background-color: var(--color-dark-gray);
      border: 6px solid var(--color-bv-blue);
    }
  }
}
</style>
