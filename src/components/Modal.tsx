import React, { useRef, useEffect, useCallback } from 'react';
import { X } from 'lucide-react'; // For the close button icon
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string; // Optional title for the modal
  className?: string; // Optional classes for the modal content div
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape, false);
      // Optional: Prevent scrolling the background when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscape, false);
      document.body.style.overflow = 'unset'; // Re-enable scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape, false);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50
                 dark:bg-opacity-70 backdrop-blur-sm p-4 animate-fade-in" // Simple animation
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        ref={modalRef}
        className={clsx(
          'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6',
          'transform transition-all duration-300 ease-out scale-95 opacity-0 animate-scale-in', // Initial state for animation
          className // Allows overriding or adding styles to the content wrapper
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {title || 'Card5'} {/* Default title if not provided */}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700
                       dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2">
          {' '}
          {/* Max height with scroll */}
          {children}
        </div>
      </div>
    </div>
  );
}
