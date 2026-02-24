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
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`min-w-0 w-full max-w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400 text-base sm:text-base md:text-lg
            border focus:ring-2 resize-y
            min-h-[120px] sm:min-h-[140px] md:min-h-[180px] lg:min-h-[200px] xl:min-h-[240px]
            ${error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
            ${className}`}
          style={{overflowX: 'auto'}}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`min-w-0 w-full max-w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-gray-100 outline-none transition-all placeholder-gray-500 dark:placeholder-gray-400 text-base sm:text-base md:text-lg
            border focus:ring-2
            min-h-[48px] sm:min-h-[56px] md:min-h-[64px] lg:min-h-[72px] xl:min-h-[80px]
            ${error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"}
            ${className}`}
          style={{overflowX: 'auto'}}
        />
      )}
    </div>
  );
}
