import React from 'react';

// FIX: Made the 'label' prop optional and conditionally rendered it.
// This allows the component to be used without an internal label, fixing an issue in
// PortalPrevidenciario.tsx where a custom label with a button is used externally.
const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; id: string; }> = ({ label, id, className, ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        {...props}
        rows={4}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${className || ''}`}
      />
    </div>
  );
}

export default Textarea;