import React, { useState, useEffect, useRef } from 'react';
import "../../styles/CategoryDropdown.css"

interface CategoryDropdownProps {
  categories: { id: string; name: string }[];
  categoryId: string;
  setCategoryId: React.Dispatch<React.SetStateAction<string>>;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories, categoryId, setCategoryId }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleSelect = (id: string, name: string) => {
    setCategoryId(id);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <label className='label'>Category</label>
      <div className="dropdownContainer" onClick={toggleDropdown}>
        <div className="dropdownSelected">
          {categoryId ? categories.find(category => category.id === categoryId)?.name : 'Select a category'}
        </div>
        <div className={`dropdownArrow ${isOpen ? 'open' : ''}`}>&#9660;</div>
      </div>

      {isOpen && (
        <div className="dropdownMenu">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="dropdownItem"
                onClick={() => handleSelect(category.id, category.name)}
              >
                {category.name}
              </div>
            ))
          ) : (
            <div className="dropdownItem disabled">No categories available! Create a category!</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
