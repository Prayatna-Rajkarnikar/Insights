import React, { useState, useEffect } from "react";
import axios from "axios";

import BlogBG from "../assets/Blog.jpg";
import UserBG from "../assets/User.jpg";

export default function Dashboard() {
  const [totalUser, setTotalUser] = useState(0);
  const [totalBlog, setTotalBlog] = useState(0);
  const [trending, setTrending] = useState(null); // null since it's one blog
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
      const response = await axios.get("/blog/trending");
      setTrending(response.data);
    } catch (error) {
      console.error("Error fetching trending blog:", error);
      setTrending(null);
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

  const getFirstImage = () => {
    return (
      trending?.content?.find((item) => item.type === "image")?.value || null
    );
  };

  return (
    <div className="h-full px-6 py-7 bg-primaryWhite">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-bold text-4xl text-primaryBlack">Dashboard</h1>
        <h3 className="font-normal text-base text-darkGray">Welcome Admin</h3>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap gap-6 mb-7 items-center justify-center">
        {/* Blogs Card */}
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

        {/* Users Card */}
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
          {topics.map((topic) => (
            <div
              key={topic.name}
              className="p-3 bg-lightGray rounded-xl flex justify-between shadow-sm shadow-darkGray m-4"
            >
              <h5 className="text-sm text-secondaryBlack">{topic.name}</h5>
              <span className="text-base font-bold text-primaryBlack">
                {topic.count}
              </span>
            </div>
          ))}
        </div>

        {/* Trending Blog Section */}
        {/* Trending Blog Section */}
        <div className="lg:w-[75%] h-full">
          <h3 className="font-medium text-base text-secondaryBlack ml-10 mb-3">
            Top Blog
          </h3>

          <div className="flex justify-center items-center p-4 h-full">
            {trending ? (
              <div className="bg-lightGray p-5 h-[220px] w-full max-w-[700px] flex gap-5 rounded-2xl shadow-md shadow-darkGray">
                <div className="w-[40%] h-full">
                  {getFirstImage() ? (
                    <img
                      src={`${axios.defaults.baseURL}${getFirstImage()}`}
                      alt="Blog"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded-xl flex items-center justify-center text-sm text-darkGray">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between w-[60%]">
                  <div>
                    <h2 className="text-xl font-bold text-primaryBlack line-clamp-2">
                      {trending.title}
                    </h2>
                    <p className="text-sm text-secondaryBlack mt-1 line-clamp-2">
                      {trending.subTitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      {trending.author?.image && (
                        <img
                          src={`${axios.defaults.baseURL}${trending.author.image}`}
                          alt="Author"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm font-medium text-primaryBlack">
                        {trending.author?.name}
                      </span>
                    </div>

                    <div className="flex space-x-4 text-sm text-secondaryBlack font-semibold">
                      <span> {trending.likeCount} Likes</span>
                      <span>{trending.commentCount} Comments</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-darkGray italic">
                No trending blog available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
