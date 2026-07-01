import type { ItemProgressStatus } from '@/types/content'

export type BackLine = {
  label?: string
  text: string
  speak?: boolean
}

export type FlashcardData = {
  id: string
  frontTitle: string
  frontSubtitle?: string
  speakFront?: string
  back: BackLine[]
  status: ItemProgressStatus
}
