import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputForm from "./InputForm";

const validateSchema = yup
	.object({
		username: yup.string().required("Trường này không được để trống"),
		password: yup.string().required("Trường này không được để trống"),
	})
	.required();

const LoginForm = () => {
	const {
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm({ resolver: yupResolver(validateSchema), mode: "onChange" });

	// handleSubmit
	const onSubmit = (data) => {
		console.log(data);
		// call api
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="">
			<div className="form-group">
				<label htmlFor="username" className="inline-block mb-2">
					Tên đăng nhập
				</label>
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
				<label htmlFor="username" className="inline-block mb-2">
					Mật khẩu
				</label>
				<InputForm
					id="username"
					type="password"
					name="password"
					placeholder="password"
					control={control}
				></InputForm>
				{errors.username && (
					<p className="input-error">{errors.username.message}</p>
				)}
			</div>
			<button
				className={`btn btn-input ${isSubmitting ? "btn-input-loading" : ""}`}
				type="submit"
				disabled={isSubmitting}
			>
				ĐĂNG NHẬP
			</button>
		</form>
	);
};

export default LoginForm;
