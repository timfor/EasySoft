import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useAuthStore } from "../../AppStateContext";
import { toast } from "react-toastify";

import "../../styles/adminGoods.css";

const AdminGoods = () => {
  const { isAuthenticated } = useAuthStore();
  const [goods, setGoods] = useState([]);
  const [editingGood, setEditingGood] = useState(null);
  const [deleteGoodId, setDeleteGoodId] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImg, setNewImg] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newStatusId, setNewStatusId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const asyncFetch = async () => {
      if (isAuthenticated && token) {
        try {
          // Запрос на получение списка товаров
          const responseGoods = await fetch(`/api/goods?limit=99999`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const goodsData = await responseGoods.json();

          if (responseGoods.ok) {
            setGoods(goodsData.goods);
          } else {
            toast.error("Ошибка: " + JSON.stringify(goodsData));
          }

          // Запрос на получение списка статусов товаров
          const responseStatuses = await fetch(`/api/goods/statuses`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const statusesData = await responseStatuses.json();

          if (responseStatuses.ok) {
            setOrderStatuses(statusesData);
          } else {
            toast.error("Ошибка: " + JSON.stringify(statusesData));
          }

          // Запрос на получение списка категорий товаров
          const responseCategories = await fetch(`/api/goods/categories`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const categoriesData = await responseCategories.json();

          if (responseCategories.ok) {
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

  const handleEditClick = (good) => {
    setEditingGood(good);
    setNewName(good.name);
    setNewPrice(good.price);
    setNewDescription(good.description);
    setNewCategoryId(good.category_id);
    setNewStatusId(good.good_status_id);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    const formData = new FormData();

    if (newDescription) {
      formData.append("description", newDescription);
    }
    if (newName) {
      formData.append("name", newName);
    }
    if (newCategoryId) {
      formData.append("category_id", newCategoryId);
    }
    if (newStatusId) {
      formData.append("good_status_id", newStatusId);
    }
    if (newPrice) {
      formData.append("price", newPrice);
    }

    if (newImg.img[0]) {
      formData.append("img", newImg);
    }

    try {
      const response = await fetch(`/api/goods/${editingGood.good_id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // Обновление списка товаров после успешного редактирования
        const updatedGoods = goods.map((good) =>
          good.good_id === editingGood.good_id
            ? {
                ...good,
                name: newName,
                price: newPrice,
                description: newDescription,
                category_id: newCategoryId,
                good_status_id: newStatusId,
                // Обновление других полей товара, если нужно
              }
            : good
        );
        setGoods(updatedGoods);
        toast.success(`Товар "${newName}" успешно обновлен.`);
        setOpenEditDialog(false);
      } else {
        toast.error("Ошибка: " + JSON.stringify(result.message));
      }
    } catch (error) {
      console.error("Ошибка:", JSON.stringify(error));
    }
  };

  const handleDeleteClick = async (goodId) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар?")) {
      try {
        const response = await fetch(`/api/goods/${goodId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          // Удаление товара из списка после успешного удаления
          const updatedGoods = goods.filter((good) => good.good_id !== goodId);
          setGoods(updatedGoods);
          toast.success(`Товар успешно удален.`);
        } else {
          toast.error("Ошибка: " + JSON.stringify(result.message));
        }
      } catch (error) {
        console.error("Ошибка:", JSON.stringify(error));
      }
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingGood(null);
    setNewName("");
    setNewPrice("");
    setNewDescription("");
    setNewImg(null);
    setNewCategoryId("");
    setNewStatusId("");
  };

  return (
    <>
      <div className="prof-right-goods">
        <h2>Список всех товаров</h2>

        <div className="GoodsAdmCont">
          {goods.map((good) => (
            <div key={good.good_id} className="good_item">
              <h3>{good.name}</h3>
              <p>Цена: {good.price}</p>
              <p>{good.description}</p>

              <img
                src={`data:image/png;base64,${good.img}`}
                width={50}
                alt={good.name}
              />

              <IconButton onClick={() => handleEditClick(good)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteClick(good.good_id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Редактирование товара</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Цена"
            type="number"
            fullWidth
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={4}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImg(e.target.files[0])}
          />

          <Select
            value={newStatusId}
            onChange={(e) => setNewStatusId(e.target.value)}
            label="Статус товара"
            fullWidth
            style={{ marginTop: 10 }}
          >
            {orderStatuses.map((status) => (
              <MenuItem
                key={status.good_status_id}
                value={status.good_status_id}
              >
                {status.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={newCategoryId}
            onChange={(e) => setNewCategoryId(e.target.value)}
            label="Категория товара"
            fullWidth
            style={{ marginTop: 10 }}
          >
            {categories.map((category) => (
              <MenuItem key={category.category_id} value={category.category_id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Отмена</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Сохранить изменения
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminGoods;
