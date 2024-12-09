import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";


interface CategoryProps {
  onCategoriesFetched: (categories: CategoryData[]) => void;
}

const Category = ({ onCategoriesFetched }: CategoryProps) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isLoaded) { 
        try {
          const response = await axios.get("http://localhost:3000/categories");
          setCategories(response.data);
          onCategoriesFetched(response.data); 
          setIsLoaded(true);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCategoriesFetched, isLoaded]);

  return null;
};

export default Category;
