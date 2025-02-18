<script setup lang="ts">
import { ref } from 'vue'
// Utils
import { validatePlayerInfoConf } from '@/utils/validatePlayerInfoConf'
// Stores
import { useChallengeStore } from '@/stores/challenge'
import { usePlayerStore } from '@/stores/player'
// Components
import LargeLogoComponent from '@/components/LargeLogoComponent.vue'
import ButtonComponent from './ButtonComponent.vue'
// Init stores
const challengeStore = useChallengeStore()
const playerStore = usePlayerStore()
// Variables
const name = ref<string>('')
const email = ref<string>('')
const phoneNumber = ref<string>('')
const privacyPolicyChecked = ref<boolean>(false)
/* const errorMsg = ref<string | null>(null) */
const formErrorObj = ref<{ [key: string]: string }>({})

async function startGame() {
  if (challengeStore.challenge?.field_game_mode.name === 'Conference mode') {
    formErrorObj.value = await validatePlayerInfoConf(
      name.value,
      email.value,
      phoneNumber.value,
      privacyPolicyChecked.value,
    )
  }

  if (challengeStore.challenge?.field_game_mode.name === 'Multiplayer mode') {
    if (!name.value) {
      formErrorObj.value = { name: 'Name is required' }
    } else {
      formErrorObj.value = {}
    }
  }

  if (Object.keys(formErrorObj.value).length === 0) {
    console.log('Start game')

    await setPlayerInfo()
  }
}

async function setPlayerInfo() {
  playerStore.setName(name.value)
  playerStore.setEmail(email.value)
  playerStore.setPhoneNumber(phoneNumber.value)
  playerStore.setprivacyPolicy(privacyPolicyChecked.value)
}
</script>

<template>
  <router-link to="/">
    <LargeLogoComponent />
  </router-link>
  <div v-if="challengeStore.challenge?.field_game_mode.name === 'Conference mode'">
    <div class="flex">
      <div class="info">
        <div
          v-if="challengeStore.challenge?.field_introduction_text"
          v-html="challengeStore.challenge?.field_introduction_text.processed"
        ></div>
        <p>PS! You only have {{ challengeStore.challenge?.field_time }} minutes.</p>
      </div>
      <!-- <span class="errorMsg" v-if="errorMsg">
        {{ errorMsg }}<span class="required-star">*</span>
      </span> -->
      <div class="wrapper">
        <label for="name">Name<span class="required-star">*</span></label>
        <span class="formError" v-if="formErrorObj.name">{{ formErrorObj.name }}</span>
        <input type="text" name="Game pin" v-model="name" required />
        <div v-if="challengeStore.challenge?.field_email_checkbox">
          <label for="email">Email<span class="required-star">*</span></label>
          <span class="formError" v-if="formErrorObj.email">{{ formErrorObj.email }}</span>
          <input type="email" name="Game pin" v-model="email" required />
        </div>
        <div v-if="challengeStore.challenge?.field_phone_checkbox">
          <label for="phone">Phone<span class="required-star">*</span></label>
          <span class="formError" v-if="formErrorObj.phoneNumber">{{
            formErrorObj.phoneNumber
          }}</span>
          <input type="tel" name="Game pin" v-model="phoneNumber" required />
        </div>

        <span class="formError" v-if="formErrorObj.privacyPolicy">{{
          formErrorObj.privacyPolicy
        }}</span>
        <label class="container privacy-policy">
          <p>
            <span class="required-star">*</span>
            I agree that my personal data will be stored until the competition has ended. The
            information will only be used to contact you as a potential winner of the competition.
            <br />
            <RouterLink to="/privacy-policy" target="_blank">Privacy Policy</RouterLink>
          </p>
          <input type="checkbox" id="checkbox" v-model="privacyPolicyChecked" required />
          <span class="checkmark"></span>
        </label>

        <ButtonComponent text="START" color="orange" @emitFunction="startGame" />
      </div>
    </div>
  </div>

  <div v-else-if="challengeStore.challenge?.field_game_mode.name === 'Multiplayer mode'">
    <div class="flex">
      <div class="info">
        <div
          v-if="challengeStore.challenge?.field_introduction_text"
          v-html="challengeStore.challenge?.field_introduction_text.processed"
        ></div>
        <p>PS! You only have {{ challengeStore.challenge?.field_time }} minutes.</p>
      </div>
      <!-- <span class="errorMsg" v-if="errorMsg">
        {{ errorMsg }}<span class="required-star">*</span>
      </span> -->
      <div class="wrapper">
        <label for="name">Name<span class="required-star">*</span></label>
        <span class="formError" v-if="formErrorObj.name">{{ formErrorObj.name }}</span>
        <input type="text" name="Game pin" v-model="name" required />

        <ButtonComponent text="START" color="orange" @emitFunction="startGame" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.info {
  max-width: 800px;
  margin-bottom: 30px;
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
  font-size: var(--step-4);
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

.formError {
  color: var(--color-bv-orange);
}

.errorMsg {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: var(--step-3);
  color: var(--color-bv-green);
  display: flex;

  .required-star {
    color: var(--color-bv-orange);
    margin-left: 5px;
    font-size: var(--step-2);
  }
}

label {
  font-size: var(--step-2);
  color: var(--color-text-color);
  display: flex;

  .required-star {
    color: var(--color-bv-orange);
    margin-left: 5px;
    font-size: 25px;
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

.privacy-policy .checkmark {
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
