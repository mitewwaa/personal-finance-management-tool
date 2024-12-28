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

  console.log(getUserIdFromToken());
  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchCategories = async () => {
      console.log("Fetching categories...");
      if (!isLoaded && userId) {
        try {
          const response = await axios.get<CategoryData[]>(`http://localhost:3000/categories/${userId}`,
            {
              headers: {
                Authorization: `Bearer: ${userId}`
              }
            }
          );
          console.log("Fetched Categories:", response.data);
          setCategories(response.data);
          onCategoriesFetched(response.data);
          setIsLoaded(true);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      } else {
        console.log("Fetch skipped: isLoaded =", isLoaded, "userId =", userId);
      }
    };
    fetchCategories();
  }, [onCategoriesFetched, isLoaded, userId]);  

  return null;
};

export default Category;