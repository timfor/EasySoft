import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"; // Импорт необходимых компонентов из MUI
import EditIcon from "@mui/icons-material/Edit"; // Импорт иконки редактирования из MUI
import DeleteIcon from "@mui/icons-material/Delete"; // Импорт иконки удаления из MUI

import { useAuthStore } from "../../AppStateContext";
import { toast } from "react-toastify";

import "../../styles/adminCategories.css";

const AdminCategories = () => {
  const { isAuthenticated } = useAuthStore();
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); // Состояние для редактируемой категории
  const [newCategoryName, setNewCategoryName] = useState(""); // Состояние для нового названия категории
  const [deletingCategory, setDeletingCategory] = useState(null); // Состояние для удаляемой категории

  const token = localStorage.getItem("token");

  useEffect(() => {
    const asyncFetch = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await fetch(`/api/goods/categories`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const categoriesData = await response.json();

          if (response.ok) {
            setCategories(categoriesData);
          } else {
            toast.error("Ошибка: " + JSON.stringify(categoriesData));
          }
        } catch (err) {
          toast.error("Ошибка: " + JSON.stringify(err));
        }
      }
    };

    asyncFetch();
  }, [isAuthenticated, token]);

  const handleEditClick = (category) => {
    setEditingCategory(category.category_id);
    setNewCategoryName(category.name);
  };

  const handleSaveClick = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Название категории не может быть пустым.");
      return;
    }

    try {
      const response = await fetch(`/api/goods/category/${editingCategory}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (response.ok) {
        const updatedCategories = categories.map((category) =>
          category.category_id === editingCategory
            ? { ...category, name: newCategoryName }
            : category
        );
        setCategories(updatedCategories);
        setEditingCategory(null);
        toast.success("Категория успешно обновлена.");
      } else {
        const errorData = await response.json();
        toast.error("Ошибка: " + JSON.stringify(errorData));
      }
    } catch (err) {
      toast.error("Ошибка: " + JSON.stringify(err));
    }
  };

  const handleDeleteClick = (category) => {
    setDeletingCategory(category.category_id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      const response = await fetch(`/api/goods/category/${deletingCategory}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedCategories = categories.filter(
          (category) => category.category_id !== deletingCategory
        );
        setCategories(updatedCategories);
        setDeletingCategory(null);
        toast.success("Категория успешно удалена.");
      } else {
        const errorData = await response.json();
        toast.error("Ошибка: " + JSON.stringify(errorData));
      }
    } catch (err) {
      toast.error("Ошибка: " + JSON.stringify(err));
    }
  };

  const handleCancelDelete = () => {
    setDeletingCategory(null);
  };

  return (
    <>
      <div className="prof-right-categories">
        <h2>Список всех категорий</h2>

        <div className="CategoriesCont">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CategoryItem
                key={category.category_id}
                category={category}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                isEditing={editingCategory === category.category_id}
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                handleSaveClick={handleSaveClick}
              />
            ))
          ) : (
            <p>Нет доступных категорий.</p>
          )}
        </div>
      </div>

      {/* Диалоговое окно для подтверждения удаления */}
      <Dialog open={Boolean(deletingCategory)} onClose={handleCancelDelete}>
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить эту категорию? Это действие нельзя
            отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const CategoryItem = ({
  category,
  onEditClick,
  onDeleteClick,
  isEditing,
  newCategoryName,
  setNewCategoryName,
  handleSaveClick,
}) => {
  const { category_id, name } = category;

  return (
    <div className="category_item">
      {isEditing ? (
        <TextField
          id="editCategory"
          fullWidth
          variant="outlined"
          size="small"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      ) : (
        <h3>{name}</h3>
      )}
      <div className="category_actions">
        {isEditing ? (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleSaveClick}
          >
            Сохранить
          </Button>
        ) : (
          <>
            <IconButton onClick={() => onEditClick(category)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDeleteClick(category)}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
