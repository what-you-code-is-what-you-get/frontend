interface Path {
  alias: string | null
  pid: number | null
  langcode: string
}

interface FieldInstructions {
  value: string
  format: string
  processed: string
}

interface Link {
  href: string
}

interface Links {
  self: Link
}

interface ResourceIdObjMeta {
  drupal_internal__target_id: number
}

interface Uid {
  type: string
  id: string
  resourceIdObjMeta: ResourceIdObjMeta
}

interface FieldAsset {
  type: string
  id: string
  resourceIdObjMeta: ResourceIdObjMeta
}

interface FieldGameMode {
  type: string
  id: string
  drupal_internal__tid: number
  drupal_internal__revision_id: number
  langcode: string
  revision_created: string
  status: boolean
  name: string
  description: string | null
  weight: number
  changed: string
  default_langcode: boolean
  revision_translation_affected: boolean
  path: Path
  links: Links
  resourceIdObjMeta: ResourceIdObjMeta
  vid: {
    type: string
    id: string
    resourceIdObjMeta: {
      drupal_internal__target_id: string
    }
  }
  revision_user: null
  parent: {
    type: string
    id: string
    resourceIdObjMeta: {
      links: {
        help: {
          href: string
          meta: {
            about: string
          }
        }
      }
    }
  }[]
  relationshipNames: string[]
}

interface Thumbnail {
  type: string
  id: string
  drupal_internal__fid: number
  langcode: string
  filename: string
  uri: {
    value: string
    url: string
  }
  filemime: string
  filesize: number
  status: boolean
  created: string
  changed: string
  links: Links
  resourceIdObjMeta: {
    alt: string
    title: string | null
    width: number
    height: number
    drupal_internal__target_id: number
  }
  uid: Uid
  relationshipNames: string[]
}

interface FieldReferenceImage {
  type: string
  id: string
  drupal_internal__mid: number
  drupal_internal__vid: number
  langcode: string
  revision_created: string
  status: boolean
  name: string
  created: string
  changed: string
  default_langcode: boolean
  revision_translation_affected: boolean
  path: Path
  links: Links
  resourceIdObjMeta: ResourceIdObjMeta
  bundle: {
    type: string
    id: string
    resourceIdObjMeta: {
      drupal_internal__target_id: string
    }
  }
  revision_user: null
  uid: Uid
  thumbnail: Thumbnail
  field_media_image: Thumbnail
  relationshipNames: string[]
}

interface NodeType {
  type: string
  id: string
  resourceIdObjMeta: {
    drupal_internal__target_id: string
  }
}

interface FieldIntroductionText {
  value: string
  format: string
  processed: string
}

export interface Challenge {
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
  field_email_checkbox: boolean
  field_game_pin: string
  field_instructions: FieldInstructions
  field_introduction_text: FieldIntroductionText
  field_phone_checkbox: boolean
  field_time: number
  links: Links
  node_type: NodeType
  revision_uid: Uid
  uid: Uid
  field_assets: FieldAsset[]
  field_game_mode: FieldGameMode
  field_reference_image: FieldReferenceImage
  relationshipNames: string[]
}
