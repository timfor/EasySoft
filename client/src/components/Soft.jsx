import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SoftBigCard from "./SoftBigCard";
const Soft = () => {
  const { good_id } = useParams();

  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch(`/api/goods/${good_id}`)
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);

  return (
    <div className="softsComp">
      {backendData.message !== undefined &&
      typeof backendData.message !== "undefined" ? (
        <h1>{backendData.message}</h1>
      ) : typeof backendData.name === "undefined" ? (
        <h3>Loading...</h3>
      ) : (
        <SoftBigCard product={backendData} />
      )}
    </div>
  );
};

export default Soft;
