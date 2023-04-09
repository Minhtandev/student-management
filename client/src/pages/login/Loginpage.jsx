import React, { useEffect } from "react";
import LoginForm from "../../components/LoginForm";
import "./Loginpage.scss";

const Loginpage = () => {
  useEffect(() => {
    window.localStorage.setItem("user-role", "");
    window.localStorage.setItem("user-qlhs", "");
  }, []);
  return (
    <div className="login-page">
      <h2>Đăng nhập</h2>
      <LoginForm></LoginForm>
    </div>
  );
};

export default Loginpage;
