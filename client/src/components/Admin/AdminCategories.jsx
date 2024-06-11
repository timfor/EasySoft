import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Select, MenuItem, Button } from "@mui/material";

import { useAuthStore } from "../../AppStateContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../../styles/addCategory.css";

const AdminCategories = () => {
  const { isAuthenticated, data } = useAuthStore();

  return <></>;
};

export default AdminCategories;
