import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import Logo from "../assets/Logo.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIspasswordVisible] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisiblity = () => {
    setIspasswordVisible(!isPasswordVisible);
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/auth/login", {
        email,
        password,
      });
      setEmail("");
      setPassword("");
      navigate("/dashboard");
      toast.success("Login Successful");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-lightGray">
      <div className="flex flex-col lg:flex-row bg-primaryWhite rounded-3xl shadow-lg w-full max-w-4xl m-6">
        {/* Image Section */}
        <div className="flex items-center justify-center p-4  lg:w-1/2 bg-lightGray">
          <img
            src={Logo}
            alt="Login Illustration"
            className="w-2/3 h-auto object-contain"
          />
        </div>
        {/* Form Section */}
        <div className="flex flex-col justify-center px-8 py-8 lg:w-1/2">
          <h1 className="text-2xl font-semibold text-primaryBlack mb-6">
            Welcome Back
          </h1>
          <form onSubmit={login}>
            <div className="space-y-3">
              <input
                className="w-full bg-secondaryWhite border border-lightGray rounded-lg p-4 text-sm text-secondaryBlack focus:outline-none focus:ring-2 focus:ring-primaryBlack"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <input
                  className="w-full bg-secondaryWhite border border-lightGray rounded-lg p-4 text-sm text-secondaryBlack focus:outline-none focus:ring-2 focus:ring-primaryBlack"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-4 top-4 cursor-pointer text-darkGray"
                  onClick={togglePasswordVisiblity}
                >
                  {isPasswordVisible ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </span>
              </div>
            </div>
            <div className="text-end mt-4">
              <Link
                className="text-sm text-darkGray hover:text-primaryBlack"
                to="/forgetPassword"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              className="mt-6 w-full py-3 rounded-full bg-primaryBlack text-primaryWhite text-base font-semibold hover:bg-secondaryBlack focus:outline-none"
              type="submit"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
