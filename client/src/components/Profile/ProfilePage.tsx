import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserData from '../../../../server/src/shared/interfaces/UserData';
import { jwtDecode } from 'jwt-decode';
import CategoryData from '../../../../server/src/shared/interfaces/CategoryData';
import CategoryCarousel from '../Categories/CategoryCarousel';
import EditProfileModal from './EditProfileModal';
import '../../styles/Profile.css';
import { FaPlus } from 'react-icons/fa';
import CategoryModal from '../Categories/CategoryModal';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<UserData | null>(null);
  const navigate = useNavigate();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
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

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('jwt_token');
      if (!token || !user) return;

      const userId = user.id;

      try {
        const response = await axios.get<{ id: string; name: string }[]>(`http://localhost:3000/categories/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(response.data);
      } catch (error) {
        setError('Error fetching categories');
      }
    };

    fetchCategories();
  }, [user]);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };
  
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  
  const openCategoryModal = () => {
    setIsCategoryModalOpen(true);
  };
  
  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };
  
  const handleCategoryCreated = (category: { id: string; name: string }) => {
    setCategories([...categories, category]);
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
        setIsProfileModalOpen(false);
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError('Error updating data');
      setTimeout(() => {
        setError(null);
      },2000);
    }
  };

  const handleCategoryDelete = async (categoryId: string) => {
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.delete(`http://localhost:3000/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setCategories(categories.filter((category) => category.id !== categoryId));
      setSuccessMessage('Category deleted successfully!');
    } catch (error) {
      setError('Error deleting category');
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
                <button className="editButton" onClick={openProfileModal}>Edit Profile</button>
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
              <CategoryCarousel 
                categories={categories} 
                onCategoryDelete={handleCategoryDelete}
              />
            </div>
            <div className='categories'>
              <button type="button" className='addCategoryButton' onClick={openCategoryModal}>
                <FaPlus className='plus' />
                <p className='text'>Add New Category</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <EditProfileModal 
        isOpen={isProfileModalOpen}
        onRequestClose={closeProfileModal}
        editForm={editForm || {}}
        setEditForm={setEditForm}
        onSaveChanges={handleSaveChanges}
        successMessage={successMessage} 
        error={error}
      />
      <CategoryModal
        isCategoryModalOpen={isCategoryModalOpen}
        onRequestClose={closeCategoryModal}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
};

export default ProfilePage;