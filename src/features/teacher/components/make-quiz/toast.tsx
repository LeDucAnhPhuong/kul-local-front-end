import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
};

const iconStyles = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600'
};

export const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  const IconComponent = toastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`flex items-center space-x-3 p-4 rounded-lg border shadow-sm ${toastStyles[type]} animate-in slide-in-from-right duration-300`}>
      <IconComponent className={`w-5 h-5 ${iconStyles[type]} flex-shrink-0`} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};