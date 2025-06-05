"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { Button } from "./button"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm p-4 rounded-lg shadow-lg border ${
            toast.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold">{toast.title}</h4>
              {toast.description && <p className="text-sm mt-1 opacity-90">{toast.description}</p>}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => dismiss(toast.id)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
