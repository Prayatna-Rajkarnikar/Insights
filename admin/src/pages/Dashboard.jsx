import React, { useState, useEffect } from "react";
import axios from "axios";

import BlogBG from "../assets/Blog.jpg";
import UserBG from "../assets/User.jpg";

export default function Dashboard() {
  const [totalUser, setTotalUser] = useState(0);
  const [totalBlog, setTotalBlog] = useState(0);
  const [trendings, setTrendings] = useState([]);

  const fetchTotalUser = async () => {
    try {
      const response = await axios.get("/admin/getTotalUser");
      setTotalUser(response.data.totalUsers);
    } catch (error) {
      console.error("Error fetching total users:", error);
    }
  };

  const fetchTotalBlog = async () => {
    try {
      const response = await axios.get("/admin/getTotalBlogs");
      setTotalBlog(response.data.totalBlogs);
    } catch (error) {
      console.error("Error fetching total blogs:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const trendingResponse = await axios.get("/blog/trending");
      setTrendings(trendingResponse.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchTotalUser();
    fetchTotalBlog();
    fetchBlogs();
  }, []);

  return (
    <div className="h-screen px-6 py-7 bg-[#F8F9FA]">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-bold text-4xl text-[#212529]">Dashboard</h1>
        <h3 className="font-normal text-base text-[#8B8F92]">Welcome Admin</h3>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-6 mb-7 items-center justify-center">
        {/* First Card */}
        <div className="relative w-full lg:w-[640px] h-[200px] rounded-xl shadow-lg p-4">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 rounded-xl"
            style={{ backgroundImage: `url(${BlogBG})` }}
          ></div>
          <div className="relative space-y-8">
            <h1 className="font-bold text-6xl md:text-8xl text-[#F8F9FA] text-center">
              {totalBlog}
            </h1>
            <h5 className="font-normal text-base text-[#E9ECEF] text-end">
              Blogs successfully created
            </h5>
          </div>
        </div>

        {/* Second Card */}
        <div className="relative w-full lg:w-[470px] h-[200px] rounded-xl shadow-lg p-4">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70 rounded-xl"
            style={{ backgroundImage: `url(${UserBG})` }}
          ></div>
          <div className="relative space-y-8">
            <h1 className="font-bold text-6xl md:text-8xl text-[#F8F9FA] text-center">
              {totalUser}
            </h1>
            <h5 className="font-normal text-base text-[#E9ECEF] text-end">
              Users
            </h5>
          </div>
        </div>
      </div>

      {/* Top users and blog section */}
      <div className="w-full h-[280px] mb-7 flex p-3 gap-6">
        {/* Users section */}
        <div className="lg:w-[25%] h-full">
          <h3 className="font-medium text-base text-[#2D3135]">Top Users</h3>
          <div className="space-y-3 mt-4 p-4 bg-[#E9ECEF] rounded-xl">
            <div className="flex items-center gap-4">
              <div>
                <img
                  src={UserBG}
                  alt="User"
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <div>
                <h5 className="font-semibold text-base">John Doe</h5>
                <p className="font-light text-xs">abhishek_parel1111</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Section */}
        <div className="lg:w-[75%] h-full">
          <h3 className="font-medium text-base text-[#2D3135] ml-10">
            Top Blogs
          </h3>
          <div className="gap-4 flex flex-wrap justify-center items-center p-4">
            {trendings.map((blog, index) => {
              const firstImage = blog.content.find(
                (contentItem) => contentItem.type === "image"
              )?.value;
              const imageUrl = firstImage
                ? `${axios.defaults.baseURL}${firstImage}`
                : null;

              return (
                <div
                  key={blog._id || index}
                  className="bg-[#E9ECEF] p-4 h-24 w-64 flex items-center justify-center rounded-xl shadow-lg"
                >
                  <div className="flex space-x-4">
                    <div className="w-28 space-y-1">
                      <h3 className="text-base font-bold text-[#212529] truncate">
                        {blog.title}
                      </h3>
                      <p className="text-xs font-normal text-[#2D3135] truncate">
                        {blog.subTitle}
                      </p>
                    </div>

                    <div>
                      {firstImage ? (
                        <img
                          src={imageUrl}
                          alt="Blog"
                          className="w-32 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-32 h-16 rounded-xl bg-gray-300 flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
