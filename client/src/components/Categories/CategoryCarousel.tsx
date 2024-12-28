import React, { useState, useEffect } from 'react';
import CategoryData from '../../../../server/src/shared/interfaces/CategoryData';


type CategoryCarouselProps = {
  categories: CategoryData[];
};

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ categories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const visibleCount = 3;

  useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          (prevIndex + visibleCount) % categories.length
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlay, categories.length]);

  const nextCategory = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) =>
      (prevIndex + visibleCount) % categories.length
    );
  };

  const prevCategory = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prevIndex) =>
      (prevIndex - visibleCount + categories.length) % categories.length
    );
  };

  const visibleCategories = categories.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  // If there are not enough categories at the end, take from the start
  if (visibleCategories.length < visibleCount) {
    visibleCategories.push(
      ...categories.slice(0, visibleCount - visibleCategories.length)
    );
  }

  return (
    <div className="categoryInfo">
      {categories.length > 0 ? (
        <div className="categoryCarousel">
          <button className="carouselButton left" onClick={prevCategory}>
            ←
          </button>
          <div className="carouselViewport">
            <div className="categoryItems">
              {visibleCategories.map((category) => (
                <div key={category.id} className="categoryItem">
                  {category.name}
                </div>
              ))}
            </div>
          </div>
          <button className="carouselButton right" onClick={nextCategory}>
            →
          </button>
        </div>
      ) : (
        <p>No categories available</p>
      )}
    </div>
  );
};

export default CategoryCarousel;
