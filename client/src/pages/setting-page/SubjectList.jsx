import React from "react";

import "../Setting.scss";

import EditIcon from "../../assets/edit-icon.png";
import DeleteIcon from "../../assets/Delete-icon.png";
import { useState, useEffect } from "react";

// import { subjectArr } from "../../config/getAPI";
import { api } from "../../api/api";
import { Button } from "../../components/Button";
import { Confirm } from "../../components/Confirm";
import { Notification } from "../../components/Notification";
import { handler, helper } from "../../handle-event/HandleEvent";

export const SubjectList = () => {
  const [subjectArrState, setSubjectArrState] = useState([]);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const apiArr = await api.getSubjectList();
      setSubjectArrState(apiArr);
    };
    getData();
  }, []);

  const handleEvent = {
    handleConfirmAcceptBtn: {
      editSubject: () => {
        //kiểm tra ràng buộc dữ liệu
        let checkEmptyMessage = helper.validateData("empty", result[0]);
        if (checkEmptyMessage !== "ok") {
          setMessage(checkEmptyMessage);
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else {
          //tạo copy
          const subjectArrStateCopy = helper.generateArrCopy(subjectArrState);

          //dò tìm phần tử mang ID cần sửa
          let index = subjectArrStateCopy.findIndex(
            (item) => item.name == result[0].name
          );

          //sửa giá trị
          subjectArrStateCopy[index] = result[0];
          subjectArrStateCopy[index].Edit = false;

          //set lại mảng, cho thông báo
          setSubjectArrState(subjectArrStateCopy);
          helper.turnOnNotification("edit");

          //Cập nhật xuống CSDL
          api.putSubject(subjectArrState[index]._id, {
            name: result[0].name,
          });
          setResult([]);
        }
      },
      addSubject: () => {
        //kiểm tra ràng buộc dữ liệu
        let checkEmptyMessage = helper.validateData("empty", result[0]);
        if (checkEmptyMessage !== "ok") {
          setMessage(checkEmptyMessage);
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else {
          //tạo copy
          const subjectArrStateCopy = helper.generateArrCopy(subjectArrState);

          //thêm item mới vào mảng copy
          const newSubjectArrStateCopy = [...subjectArrStateCopy, ...result];

          //Cập nhật mảng, xuất thông báo, ẩn dòng thêm mới
          setSubjectArrState(newSubjectArrStateCopy);
          helper.turnOnNotification("add");
          document.querySelector(".row.add").style.display = "none";

          //Cập nhật xuống CSDL
          api.postSubject({
            name: result[0].name,
            name: result[0].name,
          });
          setResult([]);
        }
      },
      deleteSubject: () => {
        //tạo copy
        const subjectArrStateCopy = helper.generateArrCopy(subjectArrState);

        //lọc phần tử bị xóa ra khỏi mảng
        const newSubjectArrStateCopy = subjectArrStateCopy.filter((item, i) => {
          return item.name !== result[0].name;
        });

        //Cập nhật mảng, hiển thị thông báo
        setSubjectArrState(newSubjectArrStateCopy);
        helper.turnOnNotification("delete");

        //Lưu xuống CSDL
        api.deleteSubject(result[0]._id);
        setResult([]);
      },
      deleteSelectedSubject: () => {
        //tạo copy
        const subjectArrStateCopy = helper.generateArrCopy(subjectArrState);

        //lọc phần tử bị xóa ra khỏi mảng
        const newSubjectArrStateCopy = subjectArrStateCopy.filter(
          (item) => !item.Checked
        );

        //Cập nhật mảng, hiển thị thông báo
        setSubjectArrState(newSubjectArrStateCopy);
        helper.turnOnNotification("delete-all");

        //Lưu xuống CSDL
        result.forEach((item) => {
          api.deleteSubject(item._id);
        });
        setResult([]);
      },
    },

    handleClickDeleteBtn: {
      subject: (e) => {
        if (e.target.classList.contains("delete-img")) {
          let index = +e.target.parentNode.getAttribute("data-set");
          setResult([subjectArrState[index]]);
          setResultUI([
            {
              "Tên môn": subjectArrState[index].name,
            },
          ]);
          helper.turnOnConfirm("delete");
        }
      },
    },
    handleSaveToEditBtn: {
      subject: (e) => {
        let subjectArrStateCopy = JSON.parse(JSON.stringify(subjectArrState));
        let index = +e.target.getAttribute("data-set");
        let inputValue = e.target.closest(".row").querySelector("input").value;
        subjectArrStateCopy[index].name = inputValue;

        let newValue = subjectArrStateCopy[index];

        setResult([newValue]);
        setResultUI([
          {
            "Tên môn": newValue.name,
          },
        ]);
        document.querySelector(".confirm.edit").style.display = "flex";
      },
    },
    handleSaveToAddBtn: {
      subject: () => {
        const inputs = document.querySelectorAll(".row.add input");
        const newItem = {
          name: helper.generateID(subjectArrState, "name", ""),
          name: inputs[0].value,
          Edit: false,
          Checked: false,
        };

        setResult([newItem]);
        setResultUI([
          {
            "Tên môn": newItem.name,
          },
        ]);
        document.querySelector(".confirm.add").style.display = "flex";
      },
    },
    handleClickDeleteAllBtn: {
      subject: () => {
        const selectedSubject = subjectArrState.filter((item) => item.Checked);
        setResult(selectedSubject);
        setResultUI(
          selectedSubject.map((item, i) => {
            return {
              "Tên môn": item.name,
            };
          })
        );
        helper.turnOnConfirm("delete-all");
      },
    },
    handleCheckbox: {
      subject: (e) => {
        let index = +e.target.getAttribute("data-set");
        const subjectArrStateCopy = JSON.parse(JSON.stringify(subjectArrState));
        subjectArrStateCopy[index].Checked =
          !subjectArrStateCopy[index].Checked;
        setSubjectArrState(subjectArrStateCopy);
      },
    },
    // handleNameInputChange: (e, i) => {
    //   let subjectArrStateCopy = JSON.parse(JSON.stringify(subjectArrState));
    //   subjectArrStateCopy[i].name = e.target.value;
    //   setSubjectArrState(subjectArrStateCopy);
    // },
  };

  return (
    <>
      <Confirm
        confirmType="edit"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("edit")}
        handleConfirmAcceptBtn={handleEvent.handleConfirmAcceptBtn.editSubject}
      />
      <Confirm
        confirmType="add"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("add")}
        handleConfirmAcceptBtn={handleEvent.handleConfirmAcceptBtn.addSubject}
      />
      <Confirm
        confirmType="delete"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("delete")}
        handleConfirmAcceptBtn={
          handleEvent.handleConfirmAcceptBtn.deleteSubject
        }
      />
      <Confirm
        confirmType="delete-all"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("delete-all")}
        handleConfirmAcceptBtn={
          handleEvent.handleConfirmAcceptBtn.deleteSelectedSubject
        }
      />
      <Notification status="failed" message={message} />

      <div className="manage-subject">
        <h3>Danh sách môn học</h3>
        <div className="guide">
          Bạn có thể chỉnh tên của môn học hoặc thêm mới một môn học chưa có
        </div>
        <div className="container">
          <div className="row heading">
            <div className="item col-10-percent center "></div>
            <div className="item col-45-percent center">Tên môn</div>
            <div className="item col-45-percent center">Thao tác</div>
          </div>
          {subjectArrState.map((item, i) => {
            return (
              <>
                <div className="row content" key={i}>
                  <div className="item col-10-percent center">
                    <input
                      type="checkbox"
                      checked={item.Checked}
                      onChange={(e) => handleEvent.handleCheckbox.subject(e)}
                      data-set={i}
                    />
                  </div>
                  <div className="item col-45-percent center">{item.name}</div>
                  <div className="item col-45-percent center">
                    <button
                      className="edit-btn"
                      data-set={i}
                      onClick={(e) =>
                        handler.handleClickEditBtn(
                          e,
                          subjectArrState,
                          setSubjectArrState
                        )
                      }>
                      <img className="edit-img" src={EditIcon} alt="" />
                    </button>
                    <button
                      className="delete-btn"
                      data-set={i}
                      onClick={(e) =>
                        handleEvent.handleClickDeleteBtn.subject(e)
                      }>
                      <img className="delete-img" src={DeleteIcon} alt="" />
                    </button>
                  </div>
                </div>
                {item.Edit ? (
                  <div className="row content">
                    <div className="item col-10-percent center"></div>
                    <div className="item col-45-percent center">
                      <input
                        type="text"
                        className="input--small"
                        placeholder="Nhập tên môn học mới..."
                        value={item.name}
                        onChange={(e) =>
                          handler.handleEditInputChange(
                            e,
                            i,
                            subjectArrState,
                            setSubjectArrState,
                            "name"
                          )
                        }
                      />
                    </div>
                    <div className="item col-45-percent center save-btn__container">
                      <button
                        onClick={(e) =>
                          handleEvent.handleSaveToEditBtn.subject(e)
                        }
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
          <div className="row content add" style={{ display: "none" }}>
            <div className="item col-10-percent center"></div>
            <div className="item col-45-percent center">
              <input
                type="text"
                className="input--small"
                placeholder="Nhập tên môn học mới..."
              />
            </div>
            <div className="item col-45-percent center save-btn__container">
              <button
                onClick={handleEvent.handleSaveToAddBtn.subject}
                className="save-btn--small">
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="btns al-center">
        <Button
          btnType="add"
          onClick={handler.handleClickAddBtn}
          innerText="Thêm mới"
        />
        <Button
          btnType="delete-selected"
          onClick={handleEvent.handleClickDeleteAllBtn.subject}
          innerText="Xóa đã chọn"
        />
      </div>
    </>
  );
};
