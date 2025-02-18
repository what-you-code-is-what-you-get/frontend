interface Path {
  alias: string | null
  pid: number | null
  langcode: string
}

interface Link {
  href: string
}

interface Links {
  self: Link
}

interface ResourceIdObjMeta {
  drupal_internal__target_id: string
}

interface NodeType {
  type: string
  id: string
  resourceIdObjMeta: ResourceIdObjMeta
}

interface Uid {
  type: string
  id: string
  resourceIdObjMeta: ResourceIdObjMeta
}

interface Submission {
  type: string
  id: string
  drupal_internal__nid: number
  drupal_internal__vid: number
  langcode: string
  revision_timestamp: string
  status: boolean
  title: string
  created: string
  changed: string
  promote: boolean
  sticky: boolean
  default_langcode: boolean
  revision_translation_affected: boolean
  path: Path
  field_challenge_id: string
  field_code: string | null
  field_email: string | null
  field_name: string
  field_personvernerklaering: boolean
  field_phone: string | null
  field_score: number | null
  links: Links
  node_type: NodeType
  revision_uid: Uid
  uid: Uid
  relationshipNames: string[]
}

export type SubmissionArray = Submission[]
