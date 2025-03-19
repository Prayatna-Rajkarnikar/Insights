import React, { useState, useEffect } from "react";
import axios from "axios";

import BlogBG from "../assets/Blog.jpg";
import UserBG from "../assets/User.jpg";

export default function Dashboard() {
  const [totalUser, setTotalUser] = useState(0);
  const [totalBlog, setTotalBlog] = useState(0);
  const [trendings, setTrendings] = useState([]);
  const [topics, setTopics] = useState([]);

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

  const fetchTopics = async () => {
    try {
      const response = await axios.get("/topic/getMostUsedTopics");
      setTopics(response.data || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopics([]);
    }
  };

  useEffect(() => {
    fetchTotalUser();
    fetchTotalBlog();
    fetchBlogs();
    fetchTopics();
  }, []);

  return (
    <div className="h-full px-6 py-7 bg-primaryWhite">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-bold text-4xl text-primaryBlack">Dashboard</h1>
        <h3 className="font-normal text-base text-darkGray">Welcome Admin</h3>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-6 mb-7 items-center justify-center">
        {/* First Card */}
        <div className="relative w-full lg:w-[640px] h-[200px] rounded-xl shadow-lg shadow-darkGray p-4">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 rounded-xl"
            style={{ backgroundImage: `url(${BlogBG})` }}
          ></div>
          <div className="relative space-y-8">
            <h1 className="font-bold text-6xl md:text-8xl text-primaryWhite text-center">
              {totalBlog}
            </h1>
            <h5 className="font-normal text-base text-darkGray text-end">
              Blogs successfully created
            </h5>
          </div>
        </div>

        {/* Second Card */}
        <div className="relative w-full lg:w-[470px] h-[200px] rounded-xl shadow-lg shadow-darkGray p-4">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 rounded-xl"
            style={{ backgroundImage: `url(${UserBG})` }}
          ></div>
          <div className="relative space-y-8">
            <h1 className="font-bold text-6xl md:text-8xl text-primaryWhite text-center">
              {totalUser}
            </h1>
            <h5 className="font-normal text-base text-darkGray text-end">
              Users
            </h5>
          </div>
        </div>
      </div>

      {/* Top topics and blog section */}
      <div className="w-full h-[280px] mb-7 flex p-3 gap-6">
        {/* Topics section */}
        <div className="lg:w-[28%] h-full">
          <h3 className="font-medium text-base text-secondaryBlack">
            Most Used Topics
          </h3>
          {topics.map((topic) => {
            return (
              <div
                key={topic.name}
                className="p-3 bg-lightGray rounded-xl flex justify-between shadow-sm shadow-darkGray m-4"
              >
                <h5 className="text-sm text-secondaryBlack">{topic.name}</h5>
                <span className="text-base font-bold text-primaryBlack">
                  {topic.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Blog Section */}
        <div className="lg:w-[75%] h-full">
          <h3 className="font-medium text-base text-secondaryBlack ml-10">
            Top Blogs
          </h3>
          <div className="gap-4 flex flex-wrap justify-start items-center p-4">
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
                  className="bg-lightGray p-4 h-24 w-64 flex items-center justify-center rounded-xl shadow-sm shadow-darkGray"
                >
                  <div className="flex space-x-4">
                    <div className="w-28 space-y-1">
                      <h3 className="text-base font-bold text-primaryBlack truncate">
                        {blog.title}
                      </h3>
                      <p className="text-xs font-normal text-secondaryBlack truncate">
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
                        <span className="text-sm text-darkGray">No Image</span>
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
