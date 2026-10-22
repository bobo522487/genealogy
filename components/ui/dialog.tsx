import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, className }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in-0 duration-200">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className={cn("relative z-50 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl animate-in zoom-in-95 duration-200", className)}>
        {children}
      </div>
    </div>
  )
}

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6 pb-4 border-b border-border/50", className)} {...props} />
)

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-bold leading-none tracking-tight font-serif text-foreground", className)} {...props} />
)

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn("text-xs text-muted-foreground leading-relaxed", className)} {...props} />
)

const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("p-6 text-sm", className)} {...props} />
)

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 border-t border-border/50 bg-muted/20", className)} {...props} />
)

const DialogClose: React.FC<{ onClose: () => void; className?: string }> = ({ onClose, className }) => (
  <button
    type="button"
    onClick={onClose}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none text-muted-foreground hover:text-foreground",
      className
    )}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
)

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogClose }
