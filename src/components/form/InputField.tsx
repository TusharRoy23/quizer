import React, { FC } from "react";

interface InputProps {
    type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
    id?: string;
    name?: string;
    placeholder?: string;
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    min?: number;
    max?: number;
    step?: number;
    allowDecimal?: boolean;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
    hint?: string; // Optional hint text
}

const Input: FC<InputProps> = ({
    type = "text",
    id,
    name,
    placeholder,
    defaultValue,
    onChange,
    className = "",
    min,
    max,
    step,
    allowDecimal = false,
    disabled = false,
    success = false,
    error = false,
    hint,
}) => {
    // Determine input styles based on state (disabled, success, error)
    let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className}`;

    // Add styles for the different states
    if (disabled) {
        inputClasses += ` text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
    } else if (error) {
        inputClasses += ` text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500`;
    } else if (success) {
        inputClasses += ` text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300  dark:text-success-400 dark:border-success-500`;
    } else {
        inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
    }

    const isValidNumberInput = (value: string): boolean => {
        // Allow empty input
        if (value === "") return true;

        // Check for invalid characters (e, +, multiple dots)
        if (/[e+-]|\.{2,}/.test(value)) return false;

        // Check for decimal when not allowed
        if (!allowDecimal && value.includes('.')) return false;

        // Convert to number
        const numValue = Number(value);

        // Check if valid number
        if (isNaN(numValue)) return false;

        // Check min/max bounds
        if (min !== undefined && numValue < Number(min)) return false;
        if (max !== undefined && numValue > Number(max)) return false;

        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type !== "number" || !onChange) {
            onChange?.(e);
            return;
        }

        const inputValue = e.target.value;

        if (isValidNumberInput(inputValue)) {
            onChange(e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (type !== "number") return;

        // Prevent invalid key presses
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
            return;
        }

        // Prevent decimal if not allowed
        if (!allowDecimal && e.key === '.') {
            e.preventDefault();
            return;
        }

        // Allow backspace
        if (e.key === "Backspace") return;

        // Check if the input would still be valid after the key press
        const currentValue = (e.target as HTMLInputElement).value;
        const potentialValue = e.key === "Backspace"
            ? currentValue.slice(0, -1)
            : currentValue + e.key;
        if (!isValidNumberInput(potentialValue)) {
            e.preventDefault();
        }
    };

    return (
        <div className="relative">
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={handleChange}
                min={min}
                max={max}
                onKeyDown={handleKeyDown}
                step={allowDecimal ? step : 1}
                disabled={disabled}
                className={inputClasses}
            />

            {/* Optional Hint Text */}
            {hint && (
                <p
                    className={`mt-1.5 text-xs ${error
                        ? "text-error-500"
                        : success
                            ? "text-success-500"
                            : "text-gray-500"
                        }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Input;
