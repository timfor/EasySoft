import { Routes, Route } from "react-router-dom";

// styles
import "./App.css"; // добавить стилей
import "./styles/Softs.css";

//components
import Notfound from "./components/notfound";

import Layout from "./pages/layout";
import UnauthorizedLayout from "./pages/UnauthorizedLayout";

import Main from "./components/Main";
import Softs1 from "./components/Softs1";
import Soft from "./components/Soft";
import Faq from "./components/Faq";
import Cart from "./components/Cart";

import Contacts from "./components/Contacts";

import Login from "./components/Login";
import Register from "./components/Register";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="faq" element={<Faq />} />
          <Route path="softs" element={<Softs1 />} />
          <Route path="soft/:good_id" element={<Soft />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<h1>profile</h1>} />
          <Route path="settings" element={<h1>settings</h1>} />
          <Route path="contacts" element={<Contacts />} />
        </Route>
        <Route path="/auth" element={<UnauthorizedLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;
