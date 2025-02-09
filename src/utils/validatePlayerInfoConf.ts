// Stores
import { useChallengeStore } from '@/stores/challenge'
// Init stores
const challengeStore = useChallengeStore()

export async function validatePlayerInfoConf(
  name: string,
  phoneNumber: string,
  email: string,
  privacyPolicyChecked: boolean,
) {
  let nameValid = false
  let emailValid = false
  let phoneNumberValid = false
  let privacyPolicyValid = false

  if (name) {
    nameValid = true
  } else {
    nameValid = false
  }

  if (challengeStore.challenge?.field_email_checkbox) {
    if (email) {
      emailValid = true
    }
  } else {
    emailValid = true
  }

  if (challengeStore.challenge?.field_phone_checkbox) {
    if (phoneNumber) {
      phoneNumberValid = true
    }
  } else {
    phoneNumberValid = true
  }

  if (privacyPolicyChecked) {
    privacyPolicyValid = true
  }

  if (nameValid && emailValid && phoneNumberValid && privacyPolicyValid) {
    return true
  } else {
    return false
  }
}
