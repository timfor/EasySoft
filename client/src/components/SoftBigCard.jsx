import React from "react";

const SoftBigCard = ({ product }) => {
  const base64Img = product.img;
  const imageUrl = `data:image/png;base64,${base64Img}`;

  return (
    <>
      <div className="container ">
        <div className="container-big-soft">
          <div className="upside-soft">
            <div className="bigSoft-leftside">
              <img src={imageUrl} alt="нету фото" />
              <h1>{product.name}</h1>
            </div>
            <div className="bigSoft-rightside">
              <div>
                <p id="PriceText">Цена: </p>
                <br />
                <p id="PriceNumRed">{product.price},00 ₽</p>
              </div>

              <button id="btnBuyGood">Купить</button>
            </div>
          </div>
          <div className="description-soft">
            <p id="desc-name-soft-page">Описание</p>
            <p id="desc-content-soft-page">{product.description}</p>
          </div>
        </div>

        {/* <div key={product.good_id} className="softs-card">
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
            <button className="aboutCard">Подробнее</button>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default SoftBigCard;
