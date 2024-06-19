import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Pagination,
} from "@mui/material";
import useCatalogStore from "../context/CatalogStore.js"; // Используем zustand
import { toast } from "react-toastify";

import ProductList from "./Card";

const Softs1 = () => {
  const [backendData, setBackendData] = useState([{}]);
  const {
    sortByPrice,
    selectedCategory,
    itemsPerPage,
    setSortByPrice,
    setSelectedCategory,
    setItemsPerPage,
  } = useCatalogStore();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // Состояние для текущей страницы
  const [Categories, setCategories] = useState([]);
  const [totalGoods, setTotalGoods] = useState(0);
  const [params, setParams] = useState();

  useEffect(() => {
    const asyncFetch = async () => {
      const response = await fetch("/api/goods/categories", {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });
      const categoriesData = await response.json();

      if (response.ok) {
        setCategories(categoriesData);
      } else {
        toast.error("Ошибка" + JSON.stringify(categoriesData));
      }
    };

    asyncFetch();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search") || "";
    setParams(searchQuery);

    let fetchUrl = `/api/goods?search=${encodeURIComponent(
      searchQuery
    )}&category=${selectedCategory}&sortByPrice=${sortByPrice}&limit=${itemsPerPage}&page=${currentPage}`;

    fetch(fetchUrl, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data.goods);
        setTotalGoods(data.totalGoods);
      });
  }, [
    location.search,
    sortByPrice,
    selectedCategory,
    itemsPerPage,
    token,
    currentPage,
  ]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1); // MUI Pagination начинает счет страниц с 1, но мы используем счет с 0 для API
    const params = new URLSearchParams(location.search);

    params.set("page", value - 1);
    navigate(`/softs?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSortByPrice("");
    setSelectedCategory("");

    const url = new URL(window.location.href);
    url.searchParams.delete("search");
    navigate(url.pathname + url.search);
  };
  return (
    <>
      <div className="softsComp">
        <div className="container container-softs">
          <div className="softs-top">
            <h2>Каталог программ</h2>
          </div>

          <div className="softs-filters">
            <div className="softs-filters-left">
              <FormControl variant="outlined" className="filter-item">
                <InputLabel id="sortByPrice-label">
                  Сортировка по цене
                </InputLabel>
                <Select
                  labelId="sortByPrice-label"
                  id="sortByPrice"
                  value={sortByPrice}
                  onChange={(e) => setSortByPrice(e.target.value)}
                  label="Сортировка по цене"
                >
                  <MenuItem value="">Без сортировки</MenuItem>
                  <MenuItem value="asc">По возрастанию</MenuItem>
                  <MenuItem value="desc">По убыванию</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" className="filter-item">
                <InputLabel id="selectedCategory-label">Категория</InputLabel>
                <Select
                  labelId="selectedCategory-label"
                  id="selectedCategory"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Категория"
                >
                  <MenuItem value="">Все категории</MenuItem>

                  {Categories.map((status) => (
                    <MenuItem
                      key={status.category_id}
                      value={status.category_id}
                    >
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" className="filter-item">
                <InputLabel id="itemsPerPage-label">
                  Элементов на странице
                </InputLabel>
                <Select
                  labelId="itemsPerPage-label"
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                  label="Элементов на странице"
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="softs-filters-right">
              <button
                onClick={() => {
                  handleClearFilters();
                  toast.success(`Фильтры очищены`);
                }}
              >
                <p>Очистить фильтры</p>
              </button>
            </div>
          </div>

          <div className="results-search-softs">
            {params ? (
              <h3 id="search-result-text">
                Результаты поиска по запросу "{params}"
              </h3>
            ) : (
              <></>
            )}
          </div>

          <div className="softs-main">
            {backendData.length === 0 ? (
              <h3 id="nothingFound">Ничего не найдено</h3>
            ) : (
              <ProductList products={backendData} />
            )}
          </div>

          <div className="pagination-container">
            <Pagination
              count={Math.ceil(totalGoods / itemsPerPage)}
              page={currentPage + 1} // MUI Pagination начинает счет с 1
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Softs1;
