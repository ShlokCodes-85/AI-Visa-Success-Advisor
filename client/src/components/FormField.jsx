import React from 'react';

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  children,
  className = "",
  icon: Icon,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {error && (
        <p className="text-red-500 text-sm font-medium mb-2">* {error}</p>
      )}
      {children ? (
        children
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border ${
            error ? "border-red-500" : "border-black"
          } bg-white text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${className}`}
        />
      )}
    </div>
  );
}
