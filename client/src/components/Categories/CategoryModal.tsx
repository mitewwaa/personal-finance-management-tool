import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { MdOutlineCancel } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

import "../../styles/CustomModal.css";

interface CategoryModalProps {
  isCategoryModalOpen: boolean;
  onRequestClose: () => void;
  onCategoryCreated: (category: { id: string; name: string }) => void;
  categoryToEdit?: { id: string; name: string } | null;
  onCategoryEdited?: (category: { id: string; name: string }) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isCategoryModalOpen,
  onRequestClose,
  onCategoryCreated,
  categoryToEdit,
  onCategoryEdited,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<"income" | "expense">("expense");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (categoryToEdit) {
      setCategoryName(categoryToEdit.name);
    }
  }, [categoryToEdit]);

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.userId || null;
    }
    return null;
  };

  const userId = getUserIdFromToken();

  const handleSaveCategory = async () => {
    if (!categoryName) {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      if (!userId) {
        setError("User is not authenticated.");
        return;
      }

      if (categoryToEdit) {
        const response = await axios.put(
          `http://localhost:3000/categories/${categoryToEdit.id}`,
          { name: categoryName, type: categoryType }
        );
        onCategoryEdited && onCategoryEdited(response.data);
      } else {
        const response = await axios.post(
          `http://localhost:3000/categories/${userId}`,
          { name: categoryName, type: categoryType }
        );
        onCategoryCreated(response.data);
      }

      setSuccessMessage("Category saved successfully!");
      setCategoryName("");
      setError(null);

      setTimeout(() => {
        onRequestClose();
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error("Error saving category:", error);
      if (error.response) {
        setError(error.response.data.message || "Something went wrong.");
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
    <Modal isOpen={isCategoryModalOpen} onRequestClose={handleCloseModal} className="customModal" appElement={document.getElementById("root") || undefined}>
      <div className="modalHeader">
        <button className="cancelButton" onClick={handleCloseModal}><MdOutlineCancel /></button>
        <h2 className="mainTitleModal">{categoryToEdit ? `Edit Category: ${categoryToEdit.name}` : "Create a New Category"}</h2>
      </div>
      <div className="modalContent">
        <div className="fieldModal">
          <label className="fieldLabel" htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="editInput"
            id="categoryName"
          />
        </div>
        <div className="fieldModal">
          <label htmlFor="categoryType" className="fieldLabel">Type</label>
          <select
            id="categoryType"
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value as "expense" | "income")}
            className="editInput"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        <button className="saveButton" onClick={handleSaveCategory}>{categoryToEdit ? "Save Changes" : "Create Category"}</button>
      </div>
    </Modal>
  );
};

export default CategoryModal;