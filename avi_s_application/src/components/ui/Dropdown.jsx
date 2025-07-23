'use client';
import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({
  children,
  placeholder = 'Select option',
  options = [],
  value = '',
  onChange,
  disabled = false,
  className = '',
  rightImage = null,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelectedValue(option.value || option);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value || option);
    }
  };

  const displayValue = selectedValue || children || placeholder;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full
          px-3 py-2 sm:px-4 sm:py-2.5
          text-left
          text-dropdown-1
          bg-transparent
          border border-gray-600
          rounded sm:rounded-md
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition-all
          duration-200
          ease-in-out
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-500'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
          flex
          items-center
          justify-between
          min-h-[44px] sm:min-h-[48px]
          font-dm-sans
          text-xs sm:text-sm
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        {...props}
      >
        <span className="truncate">{displayValue}</span>
        {rightImage && (
          <img
            src={rightImage.src}
            alt=""
            className={`w-[${rightImage.width}px] h-[${rightImage.height}px] ml-2 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length > 0 ? (
            options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left text-dropdown-1 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors duration-150 text-xs sm:text-sm"
                role="option"
                aria-selected={selectedValue === (option.value || option)}
              >
                {option.label || option}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500 text-xs sm:text-sm">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;