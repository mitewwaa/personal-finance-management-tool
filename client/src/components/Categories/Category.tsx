import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";
import { jwtDecode } from 'jwt-decode';

interface CategoryProps {
  onCategoriesFetched: (categories: CategoryData[]) => void;
}

const Category = ({ onCategoriesFetched }: CategoryProps) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.userId || null;
      } catch (err) {
        console.error("Error decoding JWT token:", err);
        return null;
      }
    }
    return null;
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isLoaded && userId) {
        try {
          const response = await axios.get<CategoryData[]>(`http://localhost:3000/categories/users/${userId}`);
          setCategories(response.data);
          onCategoriesFetched(response.data); 
          setIsLoaded(true);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };
    fetchCategories();
  }, [onCategoriesFetched, isLoaded, userId]);

  return null;
};

export default Category;