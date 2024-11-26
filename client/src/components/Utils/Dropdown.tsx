import React from "react";

interface DropdownProps {
    options: { id: string; name: string; type: string; }[]; 
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, placeholder, onChange }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select a {placeholder}</option>
        {options.map((option) => (
            <option key={option.id} value={option.name}>
                {option.name}
            </option>
        ))}
    </select>
);

export default Dropdown;