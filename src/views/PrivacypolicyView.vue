<template>
  <div>
    <LargeLogoComponent />

    <div class="privacy-policy">
      <h1>Privacy Policy</h1>
      <p>
        Providing personal information on this website is voluntary, but it is a prerequisite for
        participating in the prize draw. The basis for processing is consent from the individual.
        Bouvet Norge AS is the data processor. Data is stored in Norway. <br />
        All personal information collected (name, email and telephone) will only be used to contact
        the winner of the competition and will be deleted when the competition is concluded.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import LargeLogoComponent from '@/components/LargeLogoComponent.vue'
</script>

<style scoped>
.privacy-policy {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  h1 {
    font-size: 50px;
    margin-bottom: 20px;
    color: var(--color-bv-orange);
  }

  a {
    text-decoration: underline;

    &:hover {
      color: var(--color-bv-green);
    }
  }

  p {
    font-size: 18px;
    line-height: 28px;
  }
}
</style>
