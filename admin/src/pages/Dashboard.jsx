import React from "react";
import BlogBG from "../assets/Blog.jpg";
import UserBG from "../assets/User.jpg";

export default function Dashboard() {
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
              2000
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
              2000
            </h1>
            <h5 className="font-normal text-base text-[#E9ECEF] text-end">
              Users
            </h5>
          </div>
        </div>
      </div>

      {/* Top users and blog section */}
      <div className="">
        {/* Users section */}
        <div className="w-full lg:w-[25%]">
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
      </div>
    </div>
  );
}
