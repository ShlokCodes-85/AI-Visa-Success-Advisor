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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            error ? "border-red-500" : "border-transparent dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-black dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
        />
      )}
    </div>
  );
}
