
import * as React from "react"

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
      console.log("Toast triggered", props)
      return { id: "1", dismiss: () => {} }
    },
    dismiss: (toastId?: string) => {},
    toasts: [] as Toast[]
  }
}
