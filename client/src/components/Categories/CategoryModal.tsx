import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { MdOutlineCancel } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

import "../../styles/CustomModal.css";

interface CategoryModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onCategoryCreated: (category: { id: string; name: string }) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onRequestClose,
  onCategoryCreated,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"income" | "expense">("income");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.userId || null;
    }
    return null;
  };

  const userId = getUserIdFromToken();

  const handleCreateCategory = async () => {
    if (!newCategoryName) {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      if (!userId) {
        setError("User is not authenticated.");
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/categories/${userId}`,
        { name: newCategoryName, type: newCategoryType }
      );

      setSuccessMessage("Category created successfully!");
      setNewCategoryName("");
      setError(null);

      onCategoryCreated(response.data);

      setTimeout(() => {
        onRequestClose();
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error creating category:", error);
      if (error.response) {
        setError(error.response.data.message || "Something went wrong while creating the category.");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  const handleCloseModal = () => {
    setError(null);
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={handleCloseModal} className="customModal" appElement={document.getElementById("root") || undefined} >
      <div className="modalHeader">
        <button className="cancelButton" onClick={handleCloseModal}><MdOutlineCancel /></button>
        <h2 className="mainTitleModal">Create New Category</h2>
      </div>
      <div className="modalContent">
        <div className="fieldModal">
          <label className="fieldLabel">Category Name</label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label htmlFor="newCategoryType" className="fieldLabel">Type</label>
          <select
            id="newCategoryType"
            value={newCategoryType}
            onChange={(e) => setNewCategoryType(e.target.value as "income" | "expense")}
            className="editInput"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        <button className="saveButton" onClick={handleCreateCategory}>Create Category</button>
      </div>
    </Modal>
  );
};

export default CategoryModal;