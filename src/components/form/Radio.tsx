import React from "react";
import MarkdownRenderer from "../common/MarkdownRenderer";

interface RadioProps {
  id: string; // Unique ID for the radio button
  name: string; // Radio group name
  value: string | number; // Value of the radio button
  checked: boolean; // Whether the radio button is checked
  label: string; // Label for the radio button
  onChange: (value: string | number) => void; // Handler for value change
  className?: string; // Optional additional classes
  disabled?: boolean; // Optional disabled state for the radio button
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked,
  label,
  onChange,
  className = "",
  disabled = false,
}) => {
  // Handle keyboard events to prevent arrow key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent arrow keys from changing selection
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  };
  return (
    <label
      htmlFor={id}
      className={`relative flex cursor-pointer select-none items-start gap-3 font-medium ${disabled
        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
        : "text-gray-700 dark:text-gray-400"
        } ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <input
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={() => !disabled && onChange(value)}
          className="sr-only"
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ${checked
            ? "border-brand-500 bg-brand-500"
            : "bg-transparent border-gray-300 dark:border-gray-700"
            } ${disabled
              ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700"
              : ""
            }`}
        >
          <span
            className={`h-2 w-2 rounded-full bg-white ${checked ? "block" : "hidden"
              }`}
          ></span>
        </span>
      </div>
      {label && (
        <div className="flex-1 min-w-0">
          <MarkdownRenderer content={label} />
        </div>
      )}
    </label>
  );
};

export default Radio;