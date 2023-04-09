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
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=""
      style={{
        border: "1px #aaa solid",
        borderRadius: "10px",
        padding: "40px",
      }}>
      <div className="form-group">
        <label htmlFor="username" className="inline-block mb-2">
          Tên đăng nhập
        </label>
        <InputForm
          id="username"
          type="text"
          name="username"
          placeholder="username"
          control={control}></InputForm>
        {errors.username && (
          <p className="input-error">{errors.username.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="password" className="inline-block mb-2">
          Mật khẩu
        </label>
        <InputForm
          id="password"
          type="password"
          name="password"
          placeholder="password"
          control={control}></InputForm>
        {errors.password && (
          <p className="input-error">{errors.password.message}</p>
        )}
      </div>
      {errMessage && (
        <div style={{ width: "100%", color: "red" }}>
          <span style={{}}>{errMessage}</span>
        </div>
      )}
      <button
        style={{
          position: "relative",
          top: "20px",
        }}
        className={`btn btn-input ${isSubmitting ? "btn-input-loading" : ""}`}
        type="submit"
        disabled={isSubmitting}>
        ĐĂNG NHẬP
      </button>
    </form>
  );
};

export default LoginForm;
