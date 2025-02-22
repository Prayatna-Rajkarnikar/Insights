import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import SideNav from "./helpers/SideNav";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import Dashboard from "./pages/Dashboard";
import ManageBlogs from "./pages/ManageBlogs";
import ManageUser from "./pages/ManageUser";
import ManageSlangword from "./pages/ManageSlangword";

axios.defaults.baseURL = "http://192.168.1.74:3001";
// axios.defaults.baseURL = "http://100.64.223.109:3001";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />

        <Route
          path="/dashboard"
          element={
            <SideNav>
              <Dashboard />
            </SideNav>
          }
        />
        <Route
          path="/manageBlogs"
          element={
            <SideNav>
              <ManageBlogs />
            </SideNav>
          }
        />
        <Route
          path="/manageUsers"
          element={
            <SideNav>
              <ManageUser />
            </SideNav>
          }
        />
        <Route
          path="/manageSlangWords"
          element={
            <SideNav>
              <ManageSlangword />
            </SideNav>
          }
        />
      </Routes>
    </>
  );
}

export default App;
