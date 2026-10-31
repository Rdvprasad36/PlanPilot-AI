import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-300 bg-white">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F5FF] text-[#5B3FD9] mb-4">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-[#1B1B1F] mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
