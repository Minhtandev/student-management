import React from "react";
import "../student/Search.scss";
import InfoIcon from "../../assets/info-icon.png";
import EditIcon from "../../assets/edit-icon.png";
import DeleteIcon from "../../assets/Delete-icon.png";

import { Button } from "../../components/Button";
import { Detail } from "../../components/Detail";
import { Confirm } from "../../components/Confirm";
import { Notification } from "../../components/Notification";
import { useState, useEffect } from "react";
// import { ScoreSchoolYear } from "../../config/getAPI";
import { handler, helper } from "../../handle-event/HandleEvent";
import { api } from "../../api/api";
import ProtectedPage from "../../components/ProtectedPage";
//studentArrTemp là để hiển thị, studentScoreArr là để lưu xuống CSDL
import * as XLSX from "xlsx";
import { useHistory } from "react-router-dom";

export const SearchClass = () => {
  const histoty = useHistory();
  const [classArr, setClassArr] = useState([]);
  const [classUIArr, setClassUIArr] = useState([]);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    const getData = async () => {
      const classArr = await api.getClassDetail();
      const userFromLocal = JSON.parse(
        window.localStorage.getItem("user-qlhs")
      );

      setClassArr(classArr);
      setClassUIArr(classArr);
      setRole(userFromLocal ? userFromLocal.role : "");
    };
    getData();
  }, []);

  const handleChangeInput = (e) => {
    const inputValue = e.target.value;
    const classArrStateCopy = classArr.filter((item) => {
      for (const [key, value] of Object.entries(item)) {
        if (String(value).toLowerCase().includes(inputValue.toLowerCase()))
          return true;
      }
      return false;
    });
    setClassUIArr(classArrStateCopy);
  };

  return (
    <ProtectedPage>
      <div className="search-page">
        <h3>TRA CỨU DANH SÁCH LỚP</h3>
        <div className="guide">Nhập tên lớp hoặc năm học mà bạn muốn tìm.</div>
        <div className="grid">
          <div className="row">
            <div className="grid__item">
              <input
                onChange={(e) => handleChangeInput(e)}
                type="text"
                placeholder="Nhập thông tin học sinh để tìm..."
                className="search__input"
              />
            </div>
          </div>
        </div>

        <h4>Kết quả tìm kiếm</h4>

        <div className="container">
          <div className="row heading">
            <div className="item col-25-percent center al-center">Tên lớp</div>
            <div className="item col-25-percent center al-center">Năm học</div>
            <div className="item col-25-percent center al-center">Sĩ số</div>
            <div className="item col-25-percent center al-center">Thao tác</div>
          </div>

          {classUIArr.length === 0 && (
            <span style={{ paddingLeft: "15px" }}>
              Không tìm thấy danh sách lớp
            </span>
          )}
          {classUIArr.map((item, i) => {
            return (
              <>
                <div className="row content">
                  <div className="item col-25-percent al-center">
                    {item.name}
                  </div>
                  <div className="item col-25-percent al-center">
                    {item.schoolYear}
                  </div>
                  <div className="item col-25-percent al-center">
                    {item.students ? item.students.length : 0}
                  </div>
                  <div
                    className="item col-25-percent center al-center"
                    style={{ display: "flex" }}>
                    <Button
                      btnType="detail"
                      innerText="Xem chi tiết"
                      data-set={i}
                      onClick={() =>
                        histoty.push(`/class-detail/${item._id}`)
                      }></Button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </ProtectedPage>
  );
};
