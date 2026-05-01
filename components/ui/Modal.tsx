import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  title?: string
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, isOpen, onClose, title, children, ...props }, ref) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={cn(
            'relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto',
            className
          )}
          {...props}
        >
          {title && (
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            </div>
          )}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    )
  }
)

Modal.displayName = 'Modal'

export { Modal }