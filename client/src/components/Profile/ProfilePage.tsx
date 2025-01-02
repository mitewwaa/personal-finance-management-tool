import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserData from '../../../../server/src/shared/interfaces/UserData';
import { jwtDecode } from 'jwt-decode';
import CategoryCarousel from '../Categories/CategoryCarousel';
import CategoryModal from '../Categories/CategoryModal';
import EditProfileModal from './EditProfileModal';
import { FaPlus } from 'react-icons/fa';
import BudgetInsights from '../Insights/BudgetInsights';

import '../../styles/Profile.css';

interface ProfilePageProps {
  setIsLoggedIn: (loggedIn: boolean) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserData | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<{ id: string; name: string } | null>(null);
  
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

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token || !user) return;

      const userId = user.id;

      await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem('jwt_token');
      setIsLoggedIn(false);
      setUser(null);
      navigate('/login');
      alert('Profile deleted successfully');
    } catch (error) {
      setError('Error deleting profile');
    }
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
      const { data: budgets } = await axios.get(`http://localhost:3000/budgets/categories/${categoryId}`);
      
      if (budgets.length > 0) {
        alert('You can not delete this category because there is a budget associated with it!');
        return;
      }
  
      const token = localStorage.getItem('jwt_token');
      const response = await axios.delete(`http://localhost:3000/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        setCategories(categories.filter((category) => category.id !== categoryId));
        setSuccessMessage('Category was successfully deleted!');
      } else {
        alert('The deletion of the category was unsuccessful.');
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 404 && error.response.data.message === 'There is a budget associated with this category or the category was not found.') {
          alert('You can not delete this category because there is a budget associated with it!');
        } else {
          alert(`Error: ${error.response.data.message || error.response.statusText}`);
        }
      } else {
        alert('An error occurred while deleting the category');
      }
    }
  };  

  const handleCategoryEdit = (categoryId: string, categoryName: string) => {
    setCategoryToEdit({ id: categoryId, name: categoryName });
    setIsCategoryModalOpen(true);
  };
  
  const handleCategoryEdited = (updatedCategory: { id: string; name: string }) => {
    setCategories(categories.map((category) => (category.id === updatedCategory.id ? updatedCategory : category)));
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
                <button className="deleteButton" onClick={openDeleteModal}>Delete Profile</button>
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
                onCategoryEdit={handleCategoryEdit}
              />
            </div>
            <div className='categories'>
              <button type="button" className='addCategoryButton' onClick={openCategoryModal}>
                <FaPlus className='plus' />
                <p className='text'>Add New Category</p>
              </button>
            </div>
          </div>
          <div id='insights' className='insights'>
            <BudgetInsights userId={user.id}></BudgetInsights>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="deleteModal">
          <div className="deleteModalContent">
            <h3>Are you sure you want to delete your profile?</h3>
            <button onClick={handleDeleteProfile} className='confirmBtn'>Yes, Delete</button>
            <button onClick={closeDeleteModal} className='cancelBtn'>Cancel</button>
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
        categoryToEdit={categoryToEdit}
        onCategoryEdited={handleCategoryEdited}
      />
    </div>
  );
};

export default ProfilePage;