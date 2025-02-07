<script setup lang="ts">
import { ref } from 'vue'
import { useChallengeStore } from '@/stores/challenge'
import { usePlayerStore } from '@/stores/player'
import LargeLogoComponent from '@/components/LargeLogoComponent.vue'

const challengeStore = useChallengeStore()
const playerStore = usePlayerStore()

const name = ref<string>('')
const email = ref<string>('')
const phone = ref<string>('')
const privacyPolicyChecked = ref<boolean>(false)
const errorMsg = ref<string | null>(null)

async function startGame() {
  if (!name.value || !email.value || !phone.value || !privacyPolicyChecked.value) {
    errorMsg.value = 'Vennligst fyll ut alle påkrevde feltene.'
    return
  }
  await setPlayerInfo()
}

async function setPlayerInfo() {
  playerStore.setName(name.value)
  playerStore.setEmail(email.value)
  playerStore.setPhoneNumber(phone.value)
  playerStore.setprivacyPolicy(privacyPolicyChecked.value)
}
</script>

<template>
  <LargeLogoComponent />

  <div v-if="challengeStore.challenge?.field_game_mode.name === 'Conference mode'">
    <div class="flex">
      <div class="info">
        <div v-html="challengeStore.challenge?.field_introduction_text.processed"></div>
        <p>PS! You only have {{ challengeStore.challenge?.field_time }} minutes.</p>
      </div>
      <div class="wrapper">
        <label for="name">Name<span class="required-star">*</span></label>
        <input type="text" name="Game pin" v-model="name" required />
        <div v-if="challengeStore.challenge?.field_email_checkbox">
          <label for="email">Email<span class="required-star">*</span></label>
          <input type="email" name="Game pin" v-model="email" required />
        </div>
        <div v-if="challengeStore.challenge?.field_phone_checkbox">
          <label for="phone">Phone<span class="required-star">*</span></label>
          <input type="tel" name="Game pin" v-model="phone" required />
        </div>

        <label class="container personverner">
          <p>
            <span class="required-star">*</span>
            I agree that my personal data will be stored until the competition has ended. The
            information will only be used to contact you as a potential winner of the competition.
            <RouterLink to="/privacy-policy" target="_blank">Privacy Policy</RouterLink>
          </p>
          <input type="checkbox" id="checkbox" v-model="privacyPolicyChecked" required />
          <span class="checkmark"></span>
        </label>

        <span class="errorMsg" v-if="errorMsg">{{ errorMsg }}</span>

        <button @click="startGame">START</button>
      </div>
    </div>
  </div>

  <div v-else-if="challengeStore.challenge?.field_game_mode.name === 'Multiplayer mode'">
    <h2>Multiplayer mode intro</h2>
  </div>
</template>

<style scoped>
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
  max-width: 700px;
  margin-bottom: 40px;
  p {
    font-size: 18px;
    line-height: 28px;
  }

  a {
    text-decoration: underline;

    &:hover {
      color: var(--color-bv-green);
    }
  }
}

input[type='text'],
input[type='tel'],
input[type='email'] {
  background: var(--color-dark-gray);
  border: 2px solid var(--color-bv-orange);
  padding: 20px;
  width: 100%;
  color: var(--color-bv-green);
  font-size: 40px;
  line-height: 1;
  margin-bottom: 20px;

  &::placeholder {
    color: #494949;
  }
}

input[type='checkbox'] {
  width: 30px;
  height: 30px;
  border: 2px solid var(--color-bv-orange);
  color: var(--color-bv-orange);
  cursor: pointer;
}

.errorMsg {
  margin-top: 40px;
  margin-bottom: 10px;
  font-size: 30px;
  color: var(--color-bv-orange);
}

label {
  font-size: 20px;
  line-height: 28px;
  color: var(--color-text-color);
  margin-bottom: 10px;
  display: flex;

  .required-star {
    color: var(--color-bv-orange);
    margin-left: 5px;
    font-size: 25px;
  }
}

button {
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: var(--color-bv-orange);
  color: var(--color-text-color-dark);
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  border: 2px solid var(--color-bv-orange);
  padding: 20px;

  &:hover,
  &:focus {
    background-color: var(--color-bv-dark-orange);
  }

  &:active {
    background-color: var(--color-text-color-dark);
    color: var(--color-bv-orange);
    border: 2px solid var(--color-bv-orange);
  }
}

/* The container */
.container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 30px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

.personverner .checkmark {
  top: 10px;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
  background-color: var(--color-bv-orange);
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
</style>
