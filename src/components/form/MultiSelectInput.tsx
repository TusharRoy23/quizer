import React, { useState } from "react";

interface MultiSelectProps<T> {
    label: string;
    options: T[];
    defaultSelected?: T[];
    onChange?: (selected: T[]) => void;
    disabled?: boolean;
    getOptionValue: (option: T) => string | number;
    getOptionLabel: (option: T) => string;
    placeholder?: string;
    maxSelection?: number;
}

const MultiSelect = <T,>({
    label,
    options,
    defaultSelected = [],
    onChange,
    disabled = false,
    getOptionValue,
    getOptionLabel,
    placeholder = "Select options",
    maxSelection,
}: MultiSelectProps<T>) => {
    const [selectedOptions, setSelectedOptions] = useState<T[]>(defaultSelected);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        if (disabled) return;
        setIsOpen((prev) => !prev);
    };

    const handleSelect = (option: T) => {
        const optionValue = getOptionValue(option);
        const isSelected = selectedOptions.some(
            (selected) => getOptionValue(selected) === optionValue
        );

        let newSelectedOptions;

        if (isSelected) {
            // Remove the option if already selected
            newSelectedOptions = selectedOptions.filter(
                (selected) => getOptionValue(selected) !== optionValue
            );
        } else {
            // Check if max selection limit is reached
            if (maxSelection && selectedOptions.length >= maxSelection) {
                // Optional: Show a message or prevent selection
                console.warn(`Maximum ${maxSelection} items can be selected`);
                return;
            }
            // Add the new option
            newSelectedOptions = [...selectedOptions, option];
        }

        setSelectedOptions(newSelectedOptions);
        onChange?.(newSelectedOptions);
    };

    const removeOption = (value: string | number) => {
        const newSelectedOptions = selectedOptions.filter(
            (opt) => getOptionValue(opt) !== value
        );
        setSelectedOptions(newSelectedOptions);
        onChange?.(newSelectedOptions);
    };

    return (
        <div className="w-full">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                {label}
            </label>

            <div className="relative z-20 w-full">
                <div className="relative">
                    <div
                        onClick={toggleDropdown}
                        className={`w-full min-h-11 rounded-lg border border-gray-300 py-2 pl-3 pr-3 shadow-theme-xs outline-none transition focus:border-brand-300 focus:shadow-focus-ring dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-300 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div className="flex flex-wrap items-center gap-2 w-full">
                            {selectedOptions.length > 0 ? (
                                selectedOptions.map((option) => {
                                    const value = getOptionValue(option);
                                    const label = getOptionLabel(option);
                                    return (
                                        <div
                                            key={String(value)}
                                            className="flex items-center gap-1 rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-1.5 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
                                        >
                                            <span className="truncate max-w-[120px]">{label}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeOption(value);
                                                }}
                                                className="text-gray-500 hover:text-gray-400 dark:text-gray-400"
                                            >
                                                <svg
                                                    className="w-3 h-3 fill-current"
                                                    viewBox="0 0 14 14"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {placeholder}
                                </span>
                            )}

                            {/* Selection limit indicator */}
                            {maxSelection && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                                    {selectedOptions.length}/{maxSelection}
                                </span>
                            )}

                            {/* Always show the dropdown toggle */}
                            <div className="ml-auto pl-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDropdown();
                                    }}
                                    className="text-gray-700 outline-none cursor-pointer focus:outline-none dark:text-gray-400"
                                    disabled={disabled}
                                >
                                    <svg
                                        className={`w-5 h-5 stroke-current transition-transform ${isOpen ? "rotate-180" : ""}`}
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {isOpen && (
                        <div
                            className="absolute z-40 w-full mt-1 overflow-y-auto bg-white rounded-lg shadow-lg max-h-60 dark:bg-gray-900"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="py-1">
                                {options.map((option) => {
                                    const value = getOptionValue(option);
                                    const isSelected = selectedOptions.some(
                                        (selected) => getOptionValue(selected) === value
                                    );
                                    const isDisabled = maxSelection && selectedOptions.length >= maxSelection && !isSelected;

                                    return (
                                        <div
                                            key={String(value)}
                                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${isSelected ? 'bg-primary-50 dark:bg-gray-800' : ''
                                                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => !isDisabled && handleSelect(option)}
                                        >
                                            <div className="flex items-center">
                                                <span className="block truncate">
                                                    {getOptionLabel(option)}
                                                </span>
                                                {isDisabled && (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        (Max reached)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;