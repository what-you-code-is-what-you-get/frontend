// Stores
import { useChallengeStore } from '@/stores/challenge'
// Init stores
const challengeStore = useChallengeStore()

export async function validatePlayerInfoConf(
  name: string,
  email: string,
  phoneNumber: string,
  privacyPolicyChecked: boolean,
) {
  /*  let isNameValid = false */
  let isEmailValid = false
  /*   let isPhoneNumberValid = false
  let isPrivacyPolicyValid = false */

  // TODO: https://www.rootstrap.com/blog/how-to-implement-form-validation-with-vuelidate-in-a-vite-vue-project

  const errorObj: { [key: string]: string } = {}

  if (!name) {
    errorObj.name = 'Name is required'
  }

  if (challengeStore.challenge?.field_email_checkbox) {
    if (email) {
      const regex = /^[a-zA-Z0-9._%+-æøåÆØÅ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      isEmailValid = regex.test(email)
      if (!isEmailValid) {
        errorObj.email = 'Invalid email format'
      }
    } else {
      errorObj.email = 'Email is required'
    }
  }

  if (challengeStore.challenge?.field_phone_checkbox) {
    if (!phoneNumber) {
      errorObj.phoneNumber = 'Phone number is required'
    }
  }

  if (!privacyPolicyChecked) {
    errorObj.privacyPolicy = 'Privacy policy must be accepted'
  }

  return errorObj
}
