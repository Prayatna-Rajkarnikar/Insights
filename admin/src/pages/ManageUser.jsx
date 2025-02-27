import React, { useState, useEffect } from "react";
import axios from "axios";

const truncateStyle = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "496px",
};

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get("/admin/getUserList");
      setUsers(response.data.list);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const toggleUserStatus = async (email) => {
    try {
      await axios.patch("/admin/toggleUserStatus", { email });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, isActive: !user.isActive } : user
        )
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const fetchSearchedUsers = async (query) => {
    try {
      const response = await axios.get(`/search/searchUsers?query=${query}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      fetchAllUsers();
    } else {
      fetchSearchedUsers(e.target.value);
    }
  };

  //   Sorting by date
  const sortedUsers = [...users].sort((a, b) => {
    const userA = a.username.toLowerCase();
    const userB = b.username.toLowerCase();
    if (sortOrder === "asc") {
      return userA < userB ? -1 : userA > userB ? 1 : 0; // Ascending order
    } else {
      return userA > userB ? -1 : userA < userB ? 1 : 0; // Descending order
    }
  });

  return (
    <div className="h-full px-6 py-7 bg-primaryWhite overflow-x-hidden">
      {/* Header */}
      <div className="mb-7 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-4xl text-primaryBlack">Users</h1>
          <h3 className="font-normal text-base text-darkGray">Welcome Admin</h3>
        </div>
      </div>

      <div className="flex space-x-7 justify-end items-center mb-4">
        {/* Sort Button */}
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="bg-primaryBlack text-primaryWhite px-6 py-2 rounded-xl"
        >
          ({sortOrder === "desc" ? "Descending" : "Ascending"})
        </button>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondaryWhite ">
              <th className="text-base font-normal text-left px-6 text-secondaryBlack">
                Name
              </th>
              <th className="text-base font-normal text-left px-6 text-secondaryBlack">
                Username
              </th>
              <th className="text-base font-normal text-left px-6 text-secondaryBlack">
                Email
              </th>
              <th className="text-base font-normal text-left px-6 text-secondaryBlack">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user._id}>
                <td
                  className="text-lg font-medium w-[300px] px-6 py-2 text-secondaryBlack"
                  style={truncateStyle}
                >
                  {user.name}
                </td>
                <td className="text-lg font-medium w-[280px] px-6 py-2 text-secondaryBlack">
                  {user.username}
                </td>
                <td className="text-lg font-medium w-[480px]  px-6 py-2 text-secondaryBlack">
                  {user.email}
                </td>
                <td className="flex justify-center items-center px-4 py-2">
                  <button
                    onClick={() => toggleUserStatus(user.email)}
                    className={`px-6 py-2 rounded-xl ${
                      user.isActive
                        ? "bg-red-600 text-primaryWhite"
                        : "bg-green-600 text-primaryWhite"
                    }`}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
