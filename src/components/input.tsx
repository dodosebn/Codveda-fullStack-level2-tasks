<<<<<<< HEAD
import React from "react";
=======
import React from 'react';
>>>>>>> origin/main

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
<<<<<<< HEAD
  ({ label, error, className = "", ...props }, ref) => {
=======
  ({ label, error, className = '', ...props }, ref) => {
>>>>>>> origin/main
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
<<<<<<< HEAD
            error ? "border-red-500" : "border-gray-300"
=======
            error ? 'border-red-500' : 'border-gray-300'
>>>>>>> origin/main
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

<<<<<<< HEAD
Input.displayName = "Input";

export default Input;
=======
Input.displayName = 'Input';

export default Input;
>>>>>>> origin/main
