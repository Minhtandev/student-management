import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const ProtectedPage = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    // let userRole = window.localStorage.getItem("user-role");
    // let user = window.localStorage.getItem("user-qlhs");
    window.localStorage.setItem("user-role", "bgh");
    window.localStorage.setItem("user-qlhs", JSON.stringify({"_id":"6431776e774b60bc04d9850f","name":"Minh Tân","username":"minhtan","password":"2502","role":"bgh","__v":0}));
    // if (!user || !userRole || user == "" || userRole == "")
    //   history.push("/login");
  }, []);
  return children;
};

export default ProtectedPage;
