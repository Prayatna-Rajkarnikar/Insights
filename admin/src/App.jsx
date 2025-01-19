import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";

axios.defaults.baseURL = "http://192.168.1.78:3001";
// axios.defaults.baseURL = "http://100.64.205.196:3001";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
    </Routes>
  );
}

export default App;
