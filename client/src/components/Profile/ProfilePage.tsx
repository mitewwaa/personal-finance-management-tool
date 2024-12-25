import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserData from '../../../../server/src/shared/interfaces/UserData';
import { jwtDecode } from 'jwt-decode';
import CategoryData from '../../../../server/src/shared/interfaces/CategoryData';
import Category from '../Categories/Category';
import EditProfileModal from './EditProfileModal';

import '../../styles/Profile.css';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<UserData | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('jwt_token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get<UserData>(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setUser(response.data);
        setEditForm(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleCategoriesFetched = (categories: CategoryData[]) => {
    setCategories(categories);
  };

  const nextCategory = () => {
    if (currentIndex < categories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCategory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = async () => {
    if (!editForm) return;

    try {
      const token = localStorage.getItem('jwt_token');
      await axios.put(`http://localhost:3000/users/${editForm.id}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(editForm);
      setIsModalOpen(false);
    } catch (error) {
      setError('Error updating user data');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profileContainer">
      <h1 className="mainTitleProfile">My Profile</h1>
      {user && (
        <div className="profile">
          <div className="leftColumn">
            <h2 className="secondaryTitle">Personal information</h2>
            <div className="personalInfo">
              <div className="picContainer">
                <img src="images/profilePic.svg" className="profilePic" alt="Profile" />
                <button className="editButton" onClick={openModal}>Edit Profile</button>
              </div>
              <div className="fieldsContainer">
                <div className="field">
                  <p className="fieldLabel">First Name</p>
                  <p className="info">{user.first_name}</p>
                </div>
                <div className="field">
                  <p className="fieldLabel">Last Name</p>
                  <p className="info">{user.last_name}</p>
                </div>
                <div className="field">
                  <p className="fieldLabel">Email</p>
                  <p className="info">{user.email}</p>
                </div>
                <div className="field">
                  <p className="fieldLabel">Date of Birth</p>
                  <p className="info">{new Date(user.date_of_birth).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rightColumn">
            <h2 className="secondaryTitle">Categories</h2>
            <div className="categoryInfo">
              <div className="categoryCarousel">
                <button className="carouselButton left" onClick={prevCategory}>←</button>
                <div className="categoryItems" style={{ transform: `translateX(-${currentIndex * 170}px)` }}>
                  {categories.map((category, index) => (
                    <div key={index} className="categoryItem">
                      {category.name}
                    </div>
                  ))}
                </div>
                <button className="carouselButton right" onClick={nextCategory}>→</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Category onCategoriesFetched={handleCategoriesFetched} />

      <EditProfileModal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        editForm={editForm || {}} 
        setEditForm={setEditForm} 
        onSaveChanges={handleSaveChanges} 
      />
      
    </div>
  );
};

export default ProfilePage;