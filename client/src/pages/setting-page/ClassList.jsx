import React from "react";
import "../Setting.scss";

import EditIcon from "../../assets/edit-icon.png";
import DeleteIcon from "../../assets/Delete-icon.png";
import { useState, useEffect } from "react";

// import { classArr } from "../../config/getAPI";
import { api } from "../../api/api";

import { Button } from "../../components/Button";
import { Confirm } from "../../components/Confirm";
import { Notification } from "../../components/Notification";
import { handler, helper } from "../../handle-event/HandleEvent";
import ProtectedPage from "../../components/ProtectedPage";
export const ClassList = () => {
  const [classArrState, setClassArrState] = useState([]);
  const [gradeArrState, setGradeArrState] = useState([]);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      const apiArr = await api.getClassList();
      const gradeArr = await api.getGradeList();
      setClassArrState(
        apiArr.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
      );
      setGradeArrState(gradeArr);
    };
    getData();
  }, []);

  const handleEvent = {
    handleConfirmAcceptBtn: {
      editClass: () => {
        //kiểm tra ràng buộc dữ liệu
        let checkEmptyMessage = helper.validateData("empty", result[0]);
        // let isExisting =
        //   classArrState.find(
        //     (item) => item.name.trim() === result[0].name.trim()
        //   ) !== undefined;
        if (checkEmptyMessage !== "ok") {
          setMessage(checkEmptyMessage);
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        }
        // else if (isExisting) {
        //   setMessage("Đã tồn tại lớp");
        //   document.querySelector(
        //     ".notification--failed"
        //   ).parentElement.style.display = "flex";
        // }
        else {
          //Tạo copy
          const classArrStateCopy = helper.generateArrCopy(classArrState);

          //Tìm index phần tử bị edit
          let index = classArrStateCopy.findIndex(
            (item) => item.name == result[0].name
          );

          //Cập nhật mảng
          classArrStateCopy[index] = result[0];
          classArrStateCopy[index].Edit = false;
          setClassArrState(
            classArrStateCopy.sort((a, b) =>
              a.name > b.name ? 1 : b.name > a.name ? -1 : 0
            )
          );

          //hiển thị thông báo
          helper.turnOnNotification("edit");

          //Cập nhật xuống CSDL
          api.putClass(classArrState[index]._id, {
            name: result[0].name,
          });
          setResult([]);
        }
      },
      addClass: () => {
        //kiểm tra ràng buộc dữ liệu
        let checkEmptyMessage = helper.validateData("empty", result[0]);
        let isExisting =
          classArrState.find(
            (item) => item.name.trim() === result[0].name.trim()
          ) !== undefined;
        if (checkEmptyMessage !== "ok") {
          setMessage(checkEmptyMessage);
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else if (isExisting) {
          setMessage("Đã tồn tại lớp");
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else {
          //tạp copy
          const classArrStateCopy = helper.generateArrCopy(classArrState);

          //cập nhật mảng
          const newClassArrStateCopy = [...classArrStateCopy, ...result];
          setClassArrState(
            newClassArrStateCopy.sort((a, b) =>
              a.name > b.name ? 1 : b.name > a.name ? -1 : 0
            )
          );

          //hiển thị thông báo, ẩn dòng thêm mới
          helper.turnOnNotification("add");
          document.querySelector(".row.add").style.display = "none";

          //Tìm khối
          const grade = gradeArrState.find(
            (item) => item.name == result[0].name.slice(0, 2)
          );
          const gradeID = grade ? grade._id : "";
          //cập nhật xuống CSDL
          api.postClass({
            name: result[0].name,
            grade: gradeID,
          });
          setResult([]);
        }
      },
      deleteClass: async () => {
        //tạo copy
        const classArrStateCopy = helper.generateArrCopy(classArrState);

        //cập nhật mảng
        const newClassArrStateCopy = classArrStateCopy.filter((item, i) => {
          return item.name !== result[0].name;
        });
        setClassArrState(
          newClassArrStateCopy.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          )
        );

        //hiển thị thông báo
        helper.turnOnNotification("delete");

        //cập nhật xuống CSDL
        await api.deleteClass(result[0]._id);
        setResult([]);
      },
      deleteSelectedClass: async () => {
        //tạo copy
        const classArrStateCopy = helper.generateArrCopy(classArrState);

        //cập nhật mảng
        const newClassArrStateCopy = classArrStateCopy.filter(
          (item) => !item.Checked
        );
        setClassArrState(
          newClassArrStateCopy.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          )
        );

        //hiển thị thông báo
        helper.turnOnNotification("delete-all");

        //cập nhật xuống CSDL
        result.forEach((item) => {
          api.deleteClass(item._id);
        });
        setResult([]);
      },
    },

    handleClickDeleteBtn: {
      class: (e) => {
        if (e.target.classList.contains("delete-img")) {
          let index = +e.target.parentNode.getAttribute("data-set");
          setResult([classArrState[index]]);
          setResultUI([
            {
              "Tên lớp": classArrState[index].name,
            },
          ]);
          helper.turnOnConfirm("delete");
        }
      },
    },
    handleSaveToEditBtn: {
      class: (e) => {
        let classArrStateCopy = JSON.parse(JSON.stringify(classArrState));
        let index = +e.target.getAttribute("data-set");
        let inputs = e.target.closest(".row").querySelectorAll("input");
        let newClassname = inputs[0].value;
        classArrStateCopy[index].name = "";

        let isExisting =
          classArrStateCopy.filter((item) => item.name === newClassname)
            ?.length > 0;

        if (!isExisting) {
          classArrStateCopy[index].name = inputs[0].value;

          let newValue = classArrStateCopy[index];
          setResult([newValue]);
          setResultUI([
            {
              "Tên lớp": newValue.name,
            },
          ]);
          helper.turnOnConfirm("edit");
        } else {
          setMessage("Đã tồn tại lớp");
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        }
      },
    },
    handleSaveToAddBtn: {
      class: () => {
        const inputs = document.querySelectorAll(".row.add input");
        const newItem = {
          name: inputs[0].value,
          Edit: false,
          Checked: false,
        };

        setResult([newItem]);
        setResultUI([
          {
            "Tên lớp": newItem.name,
          },
        ]);
        helper.turnOnConfirm("add");
      },
    },
    handleClickDeleteAllBtn: {
      class: () => {
        const selectedClass = classArrState.filter((item) => item.Checked);
        setResult(selectedClass);
        setResultUI(
          selectedClass.map((item, i) => {
            return {
              "Tên lớp": item.name,
            };
          })
        );
        helper.turnOnConfirm("delete-all");
      },
    },
    handleCheckbox: {
      class: (e) => {
        let index = +e.target.getAttribute("data-set");
        const classArrStateCopy = JSON.parse(JSON.stringify(classArrState));
        classArrStateCopy[index].Checked = !classArrStateCopy[index].Checked;
        setClassArrState(classArrStateCopy);
      },
    },
    // handleNameInputChange: (e, i) => {
    //   let classArrStateCopy = JSON.parse(JSON.stringify(classArrState));
    //   classArrStateCopy[i].name = e.target.value;
    //   setClassArrState(classArrStateCopy);
    // },
  };

  return (
    <ProtectedPage>
      <Confirm
        confirmType="edit"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("edit")}
        handleConfirmAcceptBtn={handleEvent.handleConfirmAcceptBtn.editClass}
      />
      <Confirm
        confirmType="add"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("add")}
        handleConfirmAcceptBtn={handleEvent.handleConfirmAcceptBtn.addClass}
      />
      <Confirm
        confirmType="delete"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("delete")}
        handleConfirmAcceptBtn={handleEvent.handleConfirmAcceptBtn.deleteClass}
      />
      <Confirm
        confirmType="delete-all"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("delete-all")}
        handleConfirmAcceptBtn={
          handleEvent.handleConfirmAcceptBtn.deleteSelectedClass
        }
      />
      <Notification status="failed" message={message} />

      <div className="container">
        <div className="manage-class manage-class-screen">
          <h3>Danh sách các lớp</h3>
          <div className="guide">
            Bạn có thể chỉnh tên của lớp học hoặc thêm mới tên một lớp học chưa
            có
          </div>
          <div className="container">
            <div className="row heading">
              <div className="item col-10-percent center"></div>
              <div className="item col-45-percent center">Tên lớp</div>
              <div className="item col-45-percent center">Thao tác</div>
            </div>
            {classArrState.map((item, i) => {
              return (
                <>
                  <div className="row content" key={i}>
                    <div className="item col-10-percent center">
                      <input
                        type="checkbox"
                        data-set={i}
                        checked={item.Checked}
                        onChange={(e) => handleEvent.handleCheckbox.class(e)}
                      />
                    </div>
                    <div className="item col-45-percent center">
                      {item.name}
                    </div>
                    <div className="item col-45-percent center">
                      <button
                        data-set={i}
                        onClick={(e) =>
                          handler.handleClickEditBtn(
                            e,
                            classArrState,
                            setClassArrState
                          )
                        }
                        className="edit-btn">
                        <img className="edit-img" src={EditIcon} alt="" />
                      </button>
                      <button
                        className="delete-btn"
                        data-set={i}
                        onClick={(e) =>
                          handleEvent.handleClickDeleteBtn.class(e)
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
                          placeholder="Nhập tên lớp mới..."
                          value={item.name}
                          onChange={(e) =>
                            handler.handleEditInputChange(
                              e,
                              i,
                              classArrState,
                              setClassArrState,
                              "name"
                            )
                          }
                        />
                      </div>
                      <div className="item col-45-percent center save-btn__container">
                        <button
                          onClick={(e) =>
                            handleEvent.handleSaveToEditBtn.class(e)
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
                  placeholder="Nhập tên lớp mới..."
                />
              </div>
              <div className="item col-45-percent center save-btn__container">
                <button
                  onClick={handleEvent.handleSaveToAddBtn.class}
                  className="save-btn--small">
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="btns al-center" style={{ marginRight: "105px" }}>
          <Button
            btnType="add"
            onClick={handler.handleClickAddBtn}
            innerText="Thêm mới"
          />
          <Button
            btnType="delete-selected"
            onClick={handleEvent.handleClickDeleteAllBtn.class}
            innerText="Xóa đã chọn"
          />
        </div>
      </div>
    </ProtectedPage>
  );
};
