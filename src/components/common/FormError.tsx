import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
  className?: string;
}

/**
 * FormError component for displaying validation errors
 * Used in forms to show field-level or form-level errors
 */
export function FormError({ message, className = '' }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-destructive ${className}`}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
