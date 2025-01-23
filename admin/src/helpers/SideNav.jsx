import React from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { useEffect, useState } from "react";

export default function SideNav({ children }) {
  const navigate = useNavigate();

  // const performLogout = async () => {
  //   try {
  //     await axios.post("/auth/logout");
  //     navigate("/login");
  //     toast.success("Logout Successful");
  //   } catch (error) {
  //     if (error.response && error.response.data && error.response.data.error) {
  //       toast.error(error.response.data.error);
  //     } else {
  //       toast.error("Logout failed");
  //     }
  //   }
  // };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#212529] text-white p-6 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <img src={Logo} alt="Logo" className="w-24 mx-auto" />
          </div>
          <nav className="space-y-4">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "block py-2 px-4 rounded-lg bg-[#343A40]"
                  : "block py-2 px-4 rounded-lg hover:bg-[#343A40]"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/manageBlogs"
              className={({ isActive }) =>
                isActive
                  ? "block py-2 px-4 rounded-lg bg-[#343A40]"
                  : "block py-2 px-4 rounded-lg hover:bg-[#343A40]"
              }
            >
              Blogs
            </NavLink>
            <NavLink
              to="/manageUsers"
              className={({ isActive }) =>
                isActive
                  ? "block py-2 px-4 rounded-lg bg-[#343A40]"
                  : "block py-2 px-4 rounded-lg hover:bg-[#343A40]"
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/manageSlangwords"
              className={({ isActive }) =>
                isActive
                  ? "block py-2 px-4 rounded-lg bg-[#343A40]"
                  : "block py-2 px-4 rounded-lg hover:bg-[#343A40]"
              }
            >
              Slangwords
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#DEE2E6] overflow-auto">{children}</main>
    </div>
  );
}
