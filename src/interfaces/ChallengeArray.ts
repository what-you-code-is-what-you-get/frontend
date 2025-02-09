interface Link {
  href: string
}

interface Links {
  self: Link
}

interface Challenge {
  type: string
  id: string
  links: Links
}

export type ChallengeArray = Challenge[]
