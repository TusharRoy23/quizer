import { ChevronDownIcon } from "@/icons";
import Label from "./Label";
import Select from "./Select";

interface SelectInputProps<T> {
  options: T[];
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: T) => void;
  value?: T;
  getOptionValue?: (option: T) => string | number;
  getOptionLabel?: (option: T) => string;
}

const SelectInput = <T,>({
  options,
  label = "Select Input",
  placeholder = "Select Option",
  className = "dark:bg-dark-900",
  onChange,
  value,
  getOptionValue = (option: any) => option.value,
  getOptionLabel = (option: any) => option.label,
}: SelectInputProps<T>) => {
  const handleSelectChange = (selectedValue: string) => {
    const selectedOption = options.find(opt =>
      String(getOptionValue(opt)) === selectedValue
    );
    if (selectedOption && onChange) {
      onChange(selectedOption);
    }
  };

  const selectOptions = options.map(opt => ({
    value: String(getOptionValue(opt)),
    label: getOptionLabel(opt),
  }));

  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <Select
          options={selectOptions}
          placeholder={placeholder}
          onChange={handleSelectChange}
          className={className}
          defaultValue={value ? String(getOptionValue(value)) : undefined}
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
};

export default SelectInput;