
import * as React from "react"
import { logger } from '@/lib/logger';

export type Toast = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

export interface ToastActionElement {
  altText: string
}

export const useToast = () => {
  return {
    toast: (props: Omit<Toast, "id">) => {
      logger.info("Toast triggered", props)
      return { id: "1", dismiss: () => {} }
    },
    dismiss: (toastId?: string) => {},
    toasts: [] as Toast[]
  }
}
