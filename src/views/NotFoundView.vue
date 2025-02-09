<template>
  <div>
    <router-link to="/">
      <LargeLogoComponent />
    </router-link>
    <h2>404 - Not Found</h2>
  </div>
</template>

<script setup lang="ts">
import LargeLogoComponent from '@/components/LargeLogoComponent.vue'
</script>

<style scoped>
.logo-wrapper {
  padding-top: 200px;
  padding-bottom: 100px;
}
h2 {
  text-align: center;
  font-size: var(--step-8);
  color: var(--color-bv-green);
}
</style>
