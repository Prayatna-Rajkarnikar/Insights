import { useState } from "react";
import axios from "axios";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../assets/Logo.svg";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyNewPassword, setVerifyNewPassword] = useState("");
  const [isPasswordVisible, setIspasswordVisible] = useState(false);
  const [isConfPasswordVisible, setIsConfpasswordVisible] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisiblity = () => {
    setIspasswordVisible(!isPasswordVisible);
  };

  const toggleConfPasswordVisiblity = () => {
    setIsConfpasswordVisible(!isConfPasswordVisible);
  };

  const forgetPassword = async (e) => {
    e.preventDefault();

    try {
      await axios.put("/auth/forgetPassword", {
        email,
        newPassword,
        verifyNewPassword,
      });
      setEmail("");
      setNewPassword("");
      setVerifyNewPassword("");
      navigate("/");
      toast.success("Password reset successful!");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#DEE2E6]">
      <div className="flex flex-col lg:flex-row bg-[#F8F9FA] rounded-3xl shadow-lg w-full max-w-4xl m-6">
        {/* Image Section */}
        <div className="flex items-center justify-center p-4  lg:w-1/2 bg-[#DEE2E6]">
          <img
            src={Logo}
            alt="Login Illustration"
            className="w-2/3 h-auto object-contain"
          />
        </div>
        {/* Form Section */}
        <div className="flex flex-col justify-center px-8 py-8 lg:w-1/2">
          <h1 className="text-2xl font-semibold text-[#212529] mb-6">
            Welcome Back
          </h1>
          <form onSubmit={forgetPassword}>
            <div className="space-y-3">
              <input
                className="w-full bg-[#F1F3F5] border border-[#E9ECEF] rounded-lg p-4 text-sm text-[#2D3135] focus:outline-none focus:ring-2 focus:ring-[#212529]"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="relative">
                <input
                  className="w-full bg-[#F1F3F5] border border-[#E9ECEF] rounded-lg p-4 text-sm text-[#2D3135] focus:outline-none focus:ring-2 focus:ring-[#212529] pr-10"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer text-[#8B8F92]"
                  onClick={togglePasswordVisiblity}
                >
                  {isPasswordVisible ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </span>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-[#F1F3F5] border border-[#E9ECEF] rounded-lg p-4 text-sm text-[#2D3135] focus:outline-none focus:ring-2 focus:ring-[#212529]"
                  type={isConfPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={verifyNewPassword}
                  onChange={(e) => setVerifyNewPassword(e.target.value)}
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer text-[#8B8F92]"
                  onClick={toggleConfPasswordVisiblity}
                >
                  {isConfPasswordVisible ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </span>
              </div>
            </div>
            <button
              className="mt-6 w-full py-3 rounded-full bg-[#212529] text-[#F8F9FA] text-base font-semibold hover:bg-[#2D3135] focus:outline-none"
              type="submit"
            >
              Done
            </button>
            <div className="text-center mt-4">
              <Link
                className="text-sm text-[#8B8F92] hover:text-[#212529]"
                to="/"
              >
                Go back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
