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

//studentArrTemp là để hiển thị, studentScoreArr là để lưu xuống CSDL

export const SearchStudent = () => {
  const [studentInfoState, setStudentInfoState] = useState([]);
  const [studentArrTempState, setStudentArrTempState] = useState([]);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      const studentInfoArr = await api.getStudentInfoArr();
      setStudentInfoState(studentInfoArr);
      setStudentArrTempState(studentInfoArr);
    };
    getData();
  }, []);

  const handleEvent = {
    handleConfirmToDelete: async () => {
      let studentID = result[0]._id;

      //cập nhật UI
      const studentArrCopy = studentArrTempState.filter(
        (student) => student._id !== studentID
      );
      setStudentArrTempState(studentArrCopy);

      const allStudentArrCopy = studentInfoState.filter(
        (studentInfo) => studentInfo._id !== studentID
      );
      setStudentInfoState(allStudentArrCopy);

      //cập nhật CSDL
      await api.deleteStudent(studentID);

      //thông báo
      helper.turnOnNotification("delete");
    },
    handleConfirmToEdit: async () => {
      //kiểm tra ràng buộc dữ liệu

      //   //cập nhật ở UI
      let index = window.localStorage.getItem("index");
      const studentArrCopy = helper.generateArrCopy(studentArrTempState);
      studentArrCopy[index] = result[0];
      studentArrCopy[index].Edit = false;
      setStudentArrTempState(studentArrCopy);

      //   //cập nhật ở mảng dữ liệu
      let studentID = studentArrCopy[index]._id;
      await api.putStudentInfo(studentID, studentArrCopy[index]);
    },
    handleSaveBtn: (e) => {
      let studentArrStateCopy = JSON.parse(JSON.stringify(studentArrTempState));
      let index = +e.target.getAttribute("data-set");
      let inputs = e.target.closest(".row").querySelectorAll("input");
      studentArrStateCopy[index].name = inputs[0].value;
      studentArrStateCopy[index].address = inputs[1].value;
      studentArrStateCopy[index].email = inputs[2].value;
      studentArrStateCopy[index].birth = inputs[3].value;
      let newValue = studentArrStateCopy[index];
      setResult([newValue]);
      setResultUI([
        {
          "Họ tên": newValue.name,
          "Địa chỉ": newValue.address,
          Email: newValue.email,
          "Ngày sinh": newValue.birth,
        },
      ]);
      helper.turnOnConfirm("edit");
    },
    handleChangeInput: (e) => {
      const inputValue = e.target.value;
      const studentArrStateCopy = studentInfoState.filter((item) => {
        for (const [key, value] of Object.entries(item)) {
          if (String(value).toLowerCase().includes(inputValue.toLowerCase()))
            return true;
        }
        return false;
      });
      setStudentArrTempState(studentArrStateCopy);
    },

    handleClickDeleteBtn: (e) => {
      if (e.target.classList.contains("delete-img")) {
        let index = +e.target.parentNode.getAttribute("data-set");
        // console.log(index);
        setResult([studentArrTempState[index]]);
        setResultUI([
          {
            "Họ tên": studentArrTempState[index].name,
            "Địa chỉ": studentArrTempState[index].address,
            Email: studentArrTempState[index].email,
            "Ngày sinh": studentArrTempState[index].birth,
          },
        ]);
        helper.turnOnConfirm("delete");
      }
    },
  };

  return (
    <div className="search-page">
      <Detail result={resultUI} />
      <Confirm
        confirmType="edit"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("edit")}
        handleConfirmAcceptBtn={handleEvent.handleConfirmToEdit}
      />
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
              onChange={(e) => handleEvent.handleChangeInput(e)}
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
          <div className="item col-25-percent center al-left pl-70">Họ Tên</div>
          <div className="item col-25-percent center al-center">Địa chỉ</div>
          <div className="item col-25-percent center al-center">Email</div>
          <div className="item col-15-percent center al-center">Ngày sinh</div>
          <div className="item col-10-percent center al-center">Thao tác</div>
        </div>

        {studentArrTempState.map((item, i) => {
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
                    className="edit-btn"
                    data-set={i}
                    onClick={(e) =>
                      handler.handleClickEditBtn(
                        e,
                        studentArrTempState,
                        setStudentArrTempState
                      )
                    }>
                    <img src={EditIcon} alt="" className="edit-img" />
                  </button>
                  <button
                    className="delete-btn"
                    data-set={i}
                    onClick={(e) => handleEvent.handleClickDeleteBtn(e)}>
                    <img src={DeleteIcon} alt="" className="delete-img" />
                  </button>
                </div>
              </div>
              {item.Edit ? (
                <div className="row content">
                  <div className="item col-25-percent center al-left pl-50">
                    <input
                      type="text"
                      className="input--small"
                      placeholder="Nhập họ tên..."
                      value={item.name}
                      onChange={(e) =>
                        handler.handleEditInputChange(
                          e,
                          i,
                          studentArrTempState,
                          setStudentArrTempState,
                          "name"
                        )
                      }
                    />
                  </div>
                  <div className="item col-25-percent center al-center">
                    <input
                      type="text"
                      className="input--tiny"
                      placeholder="Nhập địa chỉ..."
                      value={item.address}
                      onChange={(e) =>
                        handler.handleEditInputChange(
                          e,
                          i,
                          studentArrTempState,
                          setStudentArrTempState,
                          "address"
                        )
                      }
                    />
                  </div>
                  <div className="item col-25-percent center al-center">
                    <input
                      type="text"
                      className="input--tiny"
                      placeholder="Nhập email..."
                      value={item.email}
                      onChange={(e) =>
                        handler.handleEditInputChange(
                          e,
                          i,
                          studentArrTempState,
                          setStudentArrTempState,
                          "email"
                        )
                      }
                    />
                  </div>
                  <div className="item col-15-percent center al-center">
                    <input
                      type="text"
                      className="input--tiny"
                      placeholder="Nhập ngày sinh..."
                      value={item.birth}
                      onChange={(e) =>
                        handler.handleEditInputChange(
                          e,
                          i,
                          studentArrTempState,
                          setStudentArrTempState,
                          "birth"
                        )
                      }
                    />
                  </div>
                  <div className="item col-10-percent center al-center save-btn__container">
                    <button
                      // btnType="save"
                      onClick={(e) => handleEvent.handleSaveBtn(e)}
                      data-set={i}
                      className="save-btn--small">
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <></>
              )}
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
