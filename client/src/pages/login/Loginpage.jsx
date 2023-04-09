import React from "react";
import LoginForm from "../../components/LoginForm";
import "./Loginpage.scss";
import LoginImg from "../../assets/login.png";

const Loginpage = () => {
	return (
		<div className="login-page">
			<div className="login-img">
				<img src={LoginImg} alt="" />
			</div>
			<div className="login-form">
				<h2>Đăng nhập</h2>
				<LoginForm></LoginForm>
			</div>
		</div>
	);
};

export default Loginpage;
