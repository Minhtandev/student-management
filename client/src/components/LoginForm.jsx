import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputForm from "./InputForm";
import { api } from "../api/api";
import { useHistory } from "react-router-dom";
const validateSchema = yup
	.object({
		username: yup.string().required("Trường này không được để trống"),
		password: yup.string().required("Trường này không được để trống"),
	})
	.required();

const LoginForm = () => {
	const history = useHistory();
	const [errMessage, setErrMessage] = useState("");
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm({ resolver: yupResolver(validateSchema), mode: "onChange" });
	// handleSubmit
	const onSubmit = async (data) => {
		console.log(data);
		const userArr = await api.getUserList();
		const user = userArr.find((item) => item.username === data.username);
		let isValid =
			user &&
			user.username === data.username &&
			user.password === data.password;
		if (!isValid) {
			setErrMessage("Tài khoản hoặc mật khẩu không đúng");
		} else {
			window.localStorage.setItem("user-role", user.role);
			window.localStorage.setItem("user-qlhs", JSON.stringify(user));
			history.push("/");
			window.location.reload(false);
		}
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="">
			<div className="form-group">
				<div className="inline-block mb-2">
					<svg
						width="24"
						height="24"
						viewBox="0 0 34 34"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17 2.83334C15.1396 2.83334 13.2974 3.19978 11.5787 3.91172C9.85988 4.62366 8.29816 5.66717 6.98266 6.98266C4.3259 9.63943 2.83334 13.2428 2.83334 17C2.83334 20.7572 4.3259 24.3606 6.98266 27.0174C8.29816 28.3329 9.85988 29.3764 11.5787 30.0883C13.2974 30.8002 15.1396 31.1667 17 31.1667C20.7572 31.1667 24.3606 29.6741 27.0174 27.0174C29.6741 24.3606 31.1667 20.7572 31.1667 17C31.1667 15.1396 30.8002 13.2974 30.0883 11.5787C29.3764 9.85988 28.3329 8.29816 27.0174 6.98266C25.7019 5.66717 24.1401 4.62366 22.4214 3.91172C20.7026 3.19978 18.8604 2.83334 17 2.83334ZM10.0158 25.8967C10.625 24.6217 14.3367 23.375 17 23.375C19.6633 23.375 23.375 24.6217 23.9842 25.8967C22 27.4777 19.5371 28.337 17 28.3333C14.365 28.3333 11.9425 27.4267 10.0158 25.8967ZM26.01 23.8425C23.9842 21.3775 19.0683 20.5417 17 20.5417C14.9317 20.5417 10.0158 21.3775 7.99001 23.8425C6.48294 21.8799 5.6662 19.4745 5.66668 17C5.66668 10.7525 10.7525 5.66668 17 5.66668C23.2475 5.66668 28.3333 10.7525 28.3333 17C28.3333 19.5783 27.455 21.9583 26.01 23.8425ZM17 8.50001C14.2517 8.50001 12.0417 10.71 12.0417 13.4583C12.0417 16.2067 14.2517 18.4167 17 18.4167C19.7483 18.4167 21.9583 16.2067 21.9583 13.4583C21.9583 10.71 19.7483 8.50001 17 8.50001ZM17 15.5833C16.4364 15.5833 15.8959 15.3595 15.4974 14.9609C15.0989 14.5624 14.875 14.0219 14.875 13.4583C14.875 12.8948 15.0989 12.3543 15.4974 11.9557C15.8959 11.5572 16.4364 11.3333 17 11.3333C17.5636 11.3333 18.1041 11.5572 18.5026 11.9557C18.9011 12.3543 19.125 12.8948 19.125 13.4583C19.125 14.0219 18.9011 14.5624 18.5026 14.9609C18.1041 15.3595 17.5636 15.5833 17 15.5833Z"
							fill="#2A4365"
						/>
					</svg>
					<span>Tên đăng nhập</span>
				</div>
				<InputForm
					id="username"
					type="text"
					name="username"
					placeholder="username"
					control={control}
				></InputForm>
				{errors.username && (
					<p className="input-error">{errors.username.message}</p>
				)}
			</div>
			<div className="form-group">
				<div className="inline-block mb-2">
					<svg
						width="20"
						height="20"
						viewBox="0 0 26 26"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M20.5833 11.9167H5.41667C4.22005 11.9167 3.25 12.8867 3.25 14.0834V21.6667C3.25 22.8633 4.22005 23.8334 5.41667 23.8334H20.5833C21.78 23.8334 22.75 22.8633 22.75 21.6667V14.0834C22.75 12.8867 21.78 11.9167 20.5833 11.9167Z"
							stroke="#2A4365"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M7.58334 11.9167V7.58332C7.58334 6.14673 8.15403 4.76898 9.16985 3.75316C10.1857 2.73734 11.5634 2.16666 13 2.16666C14.4366 2.16666 15.8143 2.73734 16.8302 3.75316C17.846 4.76898 18.4167 6.14673 18.4167 7.58332V11.9167"
							stroke="#2A4365"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>

					<span>Mật khẩu</span>
				</div>
				<InputForm
					id="password"
					type="password"
					name="password"
					placeholder="password"
					control={control}
				></InputForm>
				{errors.password && (
					<p className="input-error">{errors.password.message}</p>
				)}
			</div>
			{errMessage && <p className="input-error">{errMessage}</p>}
			<button
				className={`btn btn-input ${isSubmitting ? "btn-input-loading" : ""}`}
				type="submit"
				disabled={isSubmitting}
			>
				Đăng nhập
			</button>
		</form>
	);
};

export default LoginForm;
