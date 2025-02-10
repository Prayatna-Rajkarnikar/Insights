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

  const fetchAllBlogs = async () => {
    try {
      const response = await axios.get("/admin/getBlogList");
      setBlogs(response.data.list);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <div className="h-full px-6 py-7 bg-[#F8F9FA] overflow-x-hidden">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-bold text-4xl text-[#212529]">Blogs</h1>
        <h3 className="font-normal text-base text-[#8B8F92]">Welcome Admin</h3>
      </div>
      <div className="overflow-x-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-lg font-semibold">Title</th>
              <th className="text-lg font-semibold">Author</th>
              <th className="text-lg font-semibold">Created at</th>
              <th className="text-lg font-semibold">Action</th>
            </tr>
          </thead>
          {blogs.map((blog) => (
            <tbody key={blog._id}>
              <tr>
                <td
                  className="text-base font-normal w-[496px] px-4 py-2"
                  style={truncateStyle}
                >
                  {blog.title}
                </td>
                <td className="text-base font-normal text-center w-[280px]  px-4 py-2">
                  {blog.author.name}
                </td>
                <td className="text-base font-normal w-[180px] text-center px-4 py-2">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="flex justify-center items-center px-4 py-2">
                  <button className="bg-[#212529] text-[#F8F9FA] px-6 py-2 rounded-xl">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
