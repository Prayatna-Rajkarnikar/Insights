import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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
      alert("Login Successful");
      console.log("Login Successful");
    } catch (error) {
      console.error(error);
      alert("Login Failed");
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
          <form onSubmit={login}>
            <div className="space-y-3">
              <input
                className="w-full bg-[#F1F3F5] border border-[#E9ECEF] rounded-lg p-4 text-sm text-[#2D3135] focus:outline-none focus:ring-2 focus:ring-[#212529]"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full bg-[#F1F3F5] border border-[#E9ECEF] rounded-lg p-4 text-sm text-[#2D3135] focus:outline-none focus:ring-2 focus:ring-[#212529]"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-end mt-4">
              <Link
                className="text-sm text-[#8B8F92] hover:text-[#212529]"
                to="/forgetPassword"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              className="mt-6 w-full py-3 rounded-full bg-[#212529] text-[#F8F9FA] text-base font-semibold hover:bg-[#2D3135] focus:outline-none"
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
