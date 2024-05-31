import React from "react";
import { Link } from "react-router-dom";
const ProductList = ({ products }) => {
  return (
    <>
      <div className="softs-cards">
        {products.map((product) => {
          const base64Img = product.img;
          const imageUrl = `data:image/png;base64,${base64Img}`;

          return (
            <Link to={`/soft/${product.good_id}`}>
              <div key={product.good_id} className="softs-card">
                <div className="card-top">
                  <img src={imageUrl} alt="нету фото" />
                </div>
                <div className="card-center">
                  <h3>{product.name}</h3>
                  <div className="cardPrice">
                    <p>Цена: </p>
                    <p id="price">{product.price} р.</p>
                  </div>
                </div>
                <div className="card-bottom">
                  <button className="aboutCard">Перейти</button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default ProductList;
