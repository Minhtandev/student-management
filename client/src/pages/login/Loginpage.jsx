import React from "react";
import LoginForm from "../../components/LoginForm";
import "./Loginpage.scss";

const Loginpage = () => {
	return (
		<div className="container">
			<div className="login-page">
				<h2>Đăng nhập</h2>
				<LoginForm></LoginForm>
			</div>
		</div>
	);
};

export default Loginpage;
