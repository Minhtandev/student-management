import React from "react";
import "./Search.scss";
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
import { schoolYear } from "../../config/data";

//studentArrTemp là để hiển thị, studentScoreArr là để lưu xuống CSDL

export const SearchClassDetail = () => {
  const [allStudent, setAllStudent] = useState([]);
  const [allClassDeatil, setAllClassDetail] = useState([]);
  const [studentOfClass, setStudentOfClass] = useState([]);
  const [classDetail, setClassDetail] = useState(null);
  const [schoolYear, setSchoolYear] = useState("");
  const [className, setClassName] = useState("");
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      const studentInfoArr = await api.getStudentInfoArr();
      const classDetailArr = await api.getClassDetail();
      setAllStudent(studentInfoArr);
      setAllClassDetail(classDetailArr);
    };
    getData();
  }, []);

  const handleEvent = {
    handleConfirmToDelete: async () => {
      let studentID = result[0]._id;
      //cập nhật UI
      const students = studentOfClass.filter(
        (student) => student._id !== studentID
      );
      setStudentOfClass(students);
      // const allStudentArrCopy = studentInfoState.filter(
      //   (studentInfo) => studentInfo._id !== studentID
      // );
      // setStudentInfoState(allStudentArrCopy);
      const newClassDetail = classDetail;
      newClassDetail.students = classDetail.students.filter(
        (student) => student !== studentID
      );
      let classID = classDetail._id;
      console.log(classID, newClassDetail);
      //cập nhật CSDL
      await api.putClassDetail(classID, newClassDetail);
      //thông báo
      helper.turnOnNotification("delete");
    },

    handleClickDeleteBtn: (e) => {
      if (e.target.classList.contains("delete-img")) {
        let index = +e.target.parentNode.getAttribute("data-set");
        setResult([studentOfClass[index]]);
        setResultUI([
          {
            "Họ tên": studentOfClass[index].name,
            "Địa chỉ": studentOfClass[index].address,
            Email: studentOfClass[index].email,
            "Ngày sinh": studentOfClass[index].birth,
          },
        ]);
        helper.turnOnConfirm("delete");
      }
    },

    handleClickSearchBtn: () => {
      const classDetail = allClassDeatil.find(
        (classDetail) =>
          classDetail.name === className &&
          classDetail.schoolYear === schoolYear
      );
      if (classDetail) {
        setClassDetail(classDetail);

        const studentIDs = classDetail.students;
        const students =
          allStudent.filter((student) => studentIDs.includes(student._id)) ||
          [];
        setStudentOfClass(students);
      }
    },
  };

  return (
    <div className="search-page">
      <Detail result={resultUI} />
      <Confirm
        confirmType="delete"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("delete")}
        handleConfirmAcceptBtn={handleEvent.handleConfirmToDelete}
      />
      <Notification status="failed" message={message} />
      <h3>TRA CỨU HỌC SINH</h3>
      <div className="guide">
        Nhập tên học sinh, lớp, hoặc điểm mà bạn muốn tìm. Bạn có thể xem chi
        tiết, chỉnh sửa hoặc xóa học sinh ở đây.
      </div>
      <div className="grid">
        <div className="row">
          <div className="grid__item">
            <input
              onChange={(e) => setClassName(e.target.value.trim())}
              type="text"
              placeholder="Nhập tên lớp..."
              className="search__input"
            />
          </div>
          <div className="grid__item">
            <input
              onChange={(e) => setSchoolYear(e.target.value.trim())}
              type="text"
              placeholder="Nhập năm học..."
              className="search__input"
            />
          </div>
          <div className="grid__item">
            <Button
              btnType="update"
              innerText="Tìm"
              onClick={handleEvent.handleClickSearchBtn}
            />
          </div>
        </div>
      </div>

      <h4>Kết quả tìm kiếm</h4>

      <div className="container">
        <div className="row heading">
          <div className="item col-25-percent center al-left pl-70">Họ Tên</div>
          <div className="item col-25-percent center al-center">Địa chỉ</div>
          <div className="item col-25-percent center al-center">Email</div>
          <div className="item col-15-percent center al-center">Ngày sinh</div>
          <div className="item col-10-percent center al-center">Thao tác</div>
        </div>

        {studentOfClass.map((item, i) => {
          return (
            <>
              <div className="row content">
                <div className="item col-25-percent center al-left pl-50">
                  {item.name}
                </div>
                <div className="item col-25-percent center al-center">
                  {item.address}
                </div>
                <div className="item col-25-percent center al-center">
                  {item.email}
                </div>
                <div className="item col-15-percent center al-center">
                  {item.birth}
                </div>
                <div className="item col-10-percent center al-center">
                  <button
                    className="delete-btn"
                    data-set={i}
                    onClick={(e) => handleEvent.handleClickDeleteBtn(e)}>
                    <img src={DeleteIcon} alt="" className="delete-img" />
                  </button>
                </div>
              </div>
            </>
          );
        })}
      </div>
      <div className="btns">
        <Button innerText="In kết quả" btnType="export" />
      </div>
    </div>
  );
};

export default SearchClassDetail;
