
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-slate-800 border-slate-600 text-white shadow-2xl">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-green-400 font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-slate-200">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-slate-400 hover:text-white" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
