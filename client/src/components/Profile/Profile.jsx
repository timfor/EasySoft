import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "../../App.css";
import "../../styles/Profile.css";
import { useAuthStore } from "../../AppStateContext";
import profileBigImg from "../../images/profileBig.png";
import { useEventStore } from "../../context/useEventStore.js";

const Profile = () => {
  const { isAuthenticated, data } = useAuthStore();
  const [userData, setUserData] = useState(null);
  const { event } = useEventStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (isAuthenticated && token) {
          const response = await fetch(`/api/users/${data.userId}`, {
            method: "GET",
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
            },
          });
          const userData = await response.json();

          if (response.ok) {
            setUserData(userData);
          } else {
            console.error("Ошибка при получении данных пользователя");
          }
        }
      } catch (error) {
        console.error("Произошла ошибка", error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, event]);

  return (
    <>
      <div className="profileComp">
        <div className="container profileCont">
          <div className="prof-left-first">
            <div className="imgProfileDiv">
              {!userData || userData.img == "bm9uZQ==" ? ( // bm9uZQ== это "none" в языке бд хард код да я знаю но ничего поделать не могу дедлайны горят
                <img id="imgProfile" src={profileBigImg} alt="" />
              ) : (
                <img
                  id="imgProfile"
                  src={`data:image/png;base64,${userData.img}`}
                  alt=""
                />
              )}
              {userData ? <h2>{userData.name}</h2> : ""}
            </div>
            <p id="profInfoP1">{data.email}</p>
            {userData ? <p id="profInfoP2">{userData.role.name}</p> : ""}
            {userData ? <p id="profInfoP3">id: {userData.user_id}</p> : ""}

            <div className="navigationProfile"></div>
            <NavLink id="prof-link" to="./goods">
              <h3>Мои товары</h3>
            </NavLink>
            <NavLink id="prof-link" to="./orders">
              <h3>Мои заказы</h3>
            </NavLink>
            <NavLink id="prof-link" to="./settings">
              <h3>Настройки</h3>
            </NavLink>
          </div>

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Profile;
