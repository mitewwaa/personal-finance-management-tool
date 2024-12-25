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
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onRequestClose, editForm, setEditForm, onSaveChanges }) => {

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
          <label className="fieldLabel">First Name</label>
          <input
            type="text"
            name="first_name"
            value={editForm?.first_name || ''}
            onChange={handleInputChange}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={editForm?.last_name || ''}
            onChange={handleInputChange}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel">Email</label>
          <input
            type="email"
            name="email"
            value={editForm?.email || ''}
            onChange={handleInputChange}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={editForm?.date_of_birth ? new Date(editForm.date_of_birth).toISOString().split('T')[0] : ''}
            onChange={handleInputChange}
            className="editInput"
          />
        </div>
      </div>
      <button className="saveButton" onClick={onSaveChanges}>Save Changes</button>
    </Modal>
  );
};

export default EditProfileModal;