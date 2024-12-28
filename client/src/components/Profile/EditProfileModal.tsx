import React from 'react';
import Modal from 'react-modal';
import { MdOutlineCancel } from 'react-icons/md';

import '../../styles/CustomModal.css';

interface EditProfileModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  editForm: any;
  setEditForm: (form: any) => void;
  onSaveChanges: () => void;
  successMessage: string | null;
  error: string | null;
  
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onRequestClose, editForm, setEditForm, onSaveChanges, successMessage, error }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="customModal" appElement={document.getElementById('root') || undefined}>
      <div className="modalHeader">
        <button className="cancelButton" onClick={onRequestClose}><MdOutlineCancel /></button>
        <h2 className="mainTitleModal">Edit Profile</h2>
      </div>
      <div className="modalContent">
        <div className="fieldModal">
          <label className="fieldLabel" htmlFor='firstName'>First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={editForm?.first_name || ''}
            onChange={handleInputChange}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel" htmlFor='lastName'>Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={editForm?.last_name || ''}
            onChange={handleInputChange}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel" htmlFor='email'>Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={editForm?.email || ''}
            onChange={handleInputChange}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel" htmlFor='dateOfBirth'>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            id='dateOfBirth'
            value={editForm?.date_of_birth ? new Date(editForm.date_of_birth).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            className="editInput"
          />
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <button className="saveButton" onClick={onSaveChanges}>Save Changes</button>
    </Modal>
  );
};

export default EditProfileModal;