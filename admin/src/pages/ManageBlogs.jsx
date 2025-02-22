import React, { useState, useEffect } from "react";
import axios from "axios";

const truncateStyle = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "496px",
};

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  const fetchAllBlogs = async () => {
    try {
      const response = await axios.get("/admin/getBlogList");
      setBlogs(response.data.list);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const deleteBlogs = async (blogId) => {
    try {
      await axios.delete(`/blog/deleteBlog/${blogId}`);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const fetchSearchedBlogs = async (query) => {
    try {
      const response = await axios.get(`/search/searchBlogs?query=${query}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error searching blogs:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() === "") {
      fetchAllBlogs();
    } else {
      fetchSearchedBlogs(e.target.value);
    }
  };

  // Date filter
  const dateFilteredBlogs = selectedDate
    ? blogs.filter((blog) => {
        const blogDate = new Date(blog.createdAt).toISOString().split("T")[0];
        return blogDate === selectedDate;
      })
    : blogs;

  // Sorting by date
  const sortedBlogs = [...dateFilteredBlogs].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="h-full px-6 py-7 bg-primaryWhite overflow-x-hidden">
      {/* Header */}
      <div className="mb-7 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-4xl text-primaryBlack">Blogs</h1>
          <h3 className="font-normal text-base text-darkGray">Welcome Admin</h3>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by title or subtitle..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded-lg"
        />
      </div>

      {/* Filters & Sorting */}
      <div className="flex justify-between items-center mb-4">
        {/* Date Picker Filter */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg"
        />

        {/* Sort Button */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="bg-primaryBlack text-primaryWhite px-6 py-2 rounded-xl"
        >
          Sort by Date ({sortOrder === "asc" ? "⬆️" : "⬇️"})
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-secondaryWhite">
              <th className="text-base font-normal text-secondaryBlack">
                Title
              </th>
              <th className="text-base font-normal text-secondaryBlack">
                Author
              </th>
              <th className="text-base font-normal text-secondaryBlack">
                Created at
              </th>
              <th className="text-base font-normal text-secondaryBlack">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBlogs.map((blog) => (
              <tr key={blog._id}>
                <td
                  className="text-lg font-medium w-[496px] px-4 py-2 text-secondaryBlack"
                  style={truncateStyle}
                >
                  {blog.title}
                </td>
                <td className="text-lg font-medium text-center w-[280px] px-4 py-2 text-secondaryBlack">
                  {blog.author.name}
                </td>
                <td className="text-lg font-medium w-[180px] text-center px-4 py-2 text-secondaryBlack">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="flex justify-center items-center px-4 py-2">
                  <button
                    className="bg-primaryBlack text-primaryWhite px-6 py-2 rounded-xl"
                    onClick={() => deleteBlogs(blog._id)}
                  >
                    Delete
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
