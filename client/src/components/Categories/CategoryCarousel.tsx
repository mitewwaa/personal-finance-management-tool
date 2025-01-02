import React, { useState, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

type CategoryCarouselProps = {
  categories: { id: string; name: string }[];
  onCategoryDelete: (categoryId: string) => void;
  onCategoryEdit: (categoryId: string, newName: string) => void;
};

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories, onCategoryDelete, onCategoryEdit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const visibleCount = categories.length > 2 ? 3 : categories.length;
  const showArrows = categories.length > 3;

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + visibleCount) % categories.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, categories.length, visibleCount]);

  const nextCategory = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => (prevIndex + visibleCount) % categories.length);
  };

  const prevCategory = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) => (prevIndex - visibleCount + categories.length) % categories.length);
  };

  const visibleCategories = categories.slice(currentIndex, currentIndex + visibleCount);
  if (visibleCategories.length < visibleCount) {
    visibleCategories.push(...categories.slice(0, visibleCount - visibleCategories.length));
  }

  return (
    <div className="categoryInfo">
      {categories.length > 0 ? (
        <div className="categoryCarousel">
          {showArrows && (
            <button className="carouselButton left" onClick={prevCategory}>
              ←
            </button>
          )}

          <div className="carouselViewport">
            <div className="categoryItems">
              {visibleCategories.map((category, index) => (
                <div key={category.id + "_" + index} className="categoryItem">
                  {category.name}
                  <div className='categoryBtns'>
                    <button className="deleteBtn btn" onClick={() => onCategoryDelete(category.id)}> <MdDelete className="btnIcon" /> <p className='text'>Delete</p> </button>
                    <button className="editBtn btn" onClick={() => onCategoryEdit(category.id, category.name)}> <FaEdit className="btnIcon" /> <p className='text'>Edit</p> </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showArrows && (
            <button className="carouselButton right" onClick={nextCategory}>
              →
            </button>
          )}
        </div>
      ) : (
        <p className="txtProfile">You haven't created any categories yet.</p>
      )}
    </div>
  );
};

export default CategoryCarousel;