import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserData from '../../../../server/src/shared/interfaces/UserData';
import { jwtDecode } from 'jwt-decode';
import CategoryData from '../../../../server/src/shared/interfaces/CategoryData';
import Category from '../Categories/Category';
import EditProfileModal from './EditProfileModal';

import '../../styles/Profile.css';
import CategoryCarousel from '../Categories/CategoryCarousel';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<UserData | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);

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

   useEffect(() => {
    if (isAutoPlay) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
      }, 3000); // Автоматично превъртане на всеки 3 секунди
      return () => clearInterval(interval);
    }
  }, [categories.length, isAutoPlay]);

  const nextCategory = () => {
    setIsAutoPlay(false); // Спира автоматичното превъртане при ръчно действие
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  const prevCategory = () => {
    setIsAutoPlay(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + categories.length) % categories.length
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setError(null);
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
      setSuccessMessage('Your profile has been updated successfully!');
      
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError('Error updating data');
      setTimeout(() => {
        setError(null);
      },2000);
    }
  };  

  if (loading) {
    return <div>Loading...</div>;
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
              <CategoryCarousel categories={categories} />
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
        successMessage={successMessage} 
        error={error}
      />
      
    </div>
  );
};

export default ProfilePage;