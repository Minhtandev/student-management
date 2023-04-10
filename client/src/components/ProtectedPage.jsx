import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const ProtectedPage = ({ children }) => {
  const history = useHistory();
  useEffect(() => {
    let userRole = window.localStorage.getItem("user-role");
    let user = window.localStorage.getItem("user-qlhs");
    if (!user || !userRole || user == "" || userRole == "")
      history.push("/login");
  }, []);
  return children;
};

export default ProtectedPage;
