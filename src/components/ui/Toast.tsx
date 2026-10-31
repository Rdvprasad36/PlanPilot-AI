import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      aria-live="polite"
      role="status"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl border border-gray-100"
    >
      {type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 text-[#1B7F4C]" />
      ) : (
        <AlertCircle className="h-5 w-5 text-[#B3261E]" />
      )}
      <p className="text-sm font-medium text-[#1B1B1F]">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2" aria-label="Close notification">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
