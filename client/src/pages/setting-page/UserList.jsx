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
export const UserList = () => {
  const [userArr, setUserArr] = useState([]);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");

  const roleEnum = ["bgh", "gv", "pgv"];

  useEffect(() => {
    const getData = async () => {
      const apiArr = await api.getUserList();
      setUserArr(apiArr);
    };
    getData();
  }, []);

  const handleEvent = {
    handleConfirmAcceptBtn: {
      editClass: async () => {
        //kiểm tra ràng buộc dữ liệu
        let checkEmptyMessage = helper.validateData("empty", result[0]);
        let isExisting =
          userArr.find(
            (item) => item.username.trim() === result[0].username.trim()
          ) !== undefined;
        if (checkEmptyMessage !== "ok") {
          setMessage(checkEmptyMessage);
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else if (isExisting) {
          setMessage("Đã tồn tại tài khoản");
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else {
          //Tạo copy
          const classArrStateCopy = helper.generateArrCopy(userArr);

          //Tìm index phần tử bị edit
          let index = classArrStateCopy.findIndex(
            (item) => item.username == result[0].username
          );

          //Cập nhật mảng
          classArrStateCopy[index] = result[0];
          classArrStateCopy[index].Edit = false;
          setUserArr(classArrStateCopy);

          //hiển thị thông báo
          helper.turnOnNotification("edit");

          //Cập nhật xuống CSDL
          await api.putUser(userArr[index]._id, {
            name: result[0].name,
            username: result[0].username,
            password: result[0].password,
            role: result[0].role,
          });
          setResult([]);
        }
      },
      addClass: () => {
        //kiểm tra ràng buộc dữ liệu
        let checkEmptyMessage = helper.validateData("empty", result[0]);
        let isExisting =
          userArr.find(
            (item) => item.username.trim() === result[0].username.trim()
          ) !== undefined;
        if (checkEmptyMessage !== "ok") {
          setMessage(checkEmptyMessage);
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else if (isExisting) {
          setMessage("Đã tồn tại tài khoản");
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else {
          //tạp copy
          const classArrStateCopy = helper.generateArrCopy(userArr);

          //cập nhật mảng
          const newClassArrStateCopy = [...classArrStateCopy, ...result];
          setUserArr(newClassArrStateCopy);

          //hiển thị thông báo, ẩn dòng thêm mới
          helper.turnOnNotification("add");
          document.querySelector(".row.add").style.display = "none";

          //cập nhật xuống CSDL
          api.postUser({
            name: result[0].name,
            username: result[0].username,
            password: result[0].password,
            role: result[0].role,
          });
          setResult([]);
        }
      },
      deleteClass: async () => {
        //tạo copy
        const classArrStateCopy = helper.generateArrCopy(userArr);

        //cập nhật mảng
        const newClassArrStateCopy = classArrStateCopy.filter((item, i) => {
          return item.name !== result[0].name;
        });
        setUserArr(newClassArrStateCopy);

        //hiển thị thông báo
        helper.turnOnNotification("delete");

        //cập nhật xuống CSDL
        await api.deleteUser(result[0]._id);
        setResult([]);
      },
      deleteSelectedClass: async () => {
        //tạo copy
        const classArrStateCopy = helper.generateArrCopy(userArr);

        //cập nhật mảng
        const newClassArrStateCopy = classArrStateCopy.filter(
          (item) => !item.Checked
        );
        setUserArr(newClassArrStateCopy);

        //hiển thị thông báo
        helper.turnOnNotification("delete-all");

        //cập nhật xuống CSDL
        result.forEach((item) => {
          api.deleteUser(item._id);
        });
        setResult([]);
      },
    },

    handleClickDeleteBtn: {
      class: (e) => {
        if (e.target.classList.contains("delete-img")) {
          let index = +e.target.parentNode.getAttribute("data-set");
          setResult([userArr[index]]);
          setResultUI([
            {
              "Tên người dùng": userArr[index].name,
              "Tài khoản": userArr[index].username,
              "Mật khẩu": userArr[index].password,
              "Vai trò": userArr[index].role.toUpperCase(),
            },
          ]);
          helper.turnOnConfirm("delete");
        }
      },
    },
    handleSaveToEditBtn: {
      class: (e) => {
        let classArrStateCopy = JSON.parse(JSON.stringify(userArr));
        let index = +e.target.getAttribute("data-set");
        let inputs = e.target.closest(".row").querySelectorAll("input");
        classArrStateCopy[index].name = inputs[0].value;
        classArrStateCopy[index].username = inputs[1].value;
        classArrStateCopy[index].password = inputs[2].value;
        classArrStateCopy[index].role = inputs[3].value;

        let newValue = classArrStateCopy[index];

        if (!roleEnum.includes(inputs[3].value.trim())) {
          setMessage("Vai trò phải là 'bgh' hoặc 'gv' hoặc 'pgv'");
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else {
          setResult([newValue]);
          setResultUI([
            {
              "Tên người dùng": newValue.name,
              "Tài khoản": newValue.username,
              "Mật khẩu": newValue.password,
              "Vai trò": newValue.role.toUpperCase(),
            },
          ]);
          helper.turnOnConfirm("edit");
        }
      },
    },
    handleSaveToAddBtn: {
      class: () => {
        const inputs = document.querySelectorAll(".row.add input");
        const newItem = {
          name: inputs[0].value,
          username: inputs[1].value,
          password: inputs[2].value,
          role: inputs[3].value.trim(),
          Edit: false,
          Checked: false,
        };

        //Nếu vai trò không thuộc vai trò cho phép thì báo lỗi
        if (!roleEnum.includes(inputs[3].value.trim())) {
          setMessage("Vai trò phải là 'bgh' hoặc 'gv' hoặc 'pgv'");
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else {
          setResult([newItem]);
          setResultUI([
            {
              "Tên người dùng": newItem.name,
              "Tài khoản": newItem.username,
              "Mật khẩu": newItem.password,
              "Vai trò": newItem.role.toUpperCase(),
            },
          ]);
          helper.turnOnConfirm("add");
        }
      },
    },
    handleClickDeleteAllBtn: {
      class: () => {
        const selectedClass = userArr.filter((item) => item.Checked);
        setResult(selectedClass);
        setResultUI(
          selectedClass.map((item, i) => {
            return {
              "Tên người dùng": item.name,
              "Tài khoản": item.username,
              "Mật khẩu": item.password,
              "Vai trò": item.role.toUpperCase(),
            };
          })
        );
        helper.turnOnConfirm("delete-all");
      },
    },
    handleCheckbox: {
      class: (e) => {
        let index = +e.target.getAttribute("data-set");
        const classArrStateCopy = JSON.parse(JSON.stringify(userArr));
        classArrStateCopy[index].Checked = !classArrStateCopy[index].Checked;
        setUserArr(classArrStateCopy);
      },
    },
    // handleNameInputChange: (e, i) => {
    //   let classArrStateCopy = JSON.parse(JSON.stringify(userArr));
    //   classArrStateCopy[i].name = e.target.value;
    //   setUserArr(classArrStateCopy);
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

      <div className="manage-class">
        <h3>Danh sách các lớp</h3>
        <div className="guide">
          Có ba vai trò là ban giám hiệu, phòng giáo vụ, giáo viên được viết tắt
          lần lượt thành "bgh", "pgv", "gv".
        </div>
        <div className="container">
          <div className="row heading">
            <div className="item col-5-percent center"></div>
            <div className="item col-20-percent center">Tên người dùng</div>
            <div className="item col-20-percent center">Tài khoản</div>
            <div className="item col-20-percent center">Mật khẩu</div>
            <div className="item col-20-percent center">Vai trò</div>
            <div className="item col-15-percent center">Thao tác</div>
          </div>
          {userArr.map((item, i) => {
            return (
              <>
                <div className="row content" key={i}>
                  <div className="item col-5-percent center">
                    <input
                      type="checkbox"
                      data-set={i}
                      checked={item.Checked}
                      onChange={(e) => handleEvent.handleCheckbox.class(e)}
                    />
                  </div>
                  <div className="item col-20-percent center">{item.name}</div>
                  <div className="item col-20-percent center">
                    {item.username}
                  </div>
                  <div className="item col-20-percent center">
                    {item.password}
                  </div>
                  <div className="item col-20-percent center">{item.role}</div>
                  <div className="item col-15-percent center">
                    <button
                      data-set={i}
                      onClick={(e) =>
                        handler.handleClickEditBtn(e, userArr, setUserArr)
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
                    <div className="item col-5-percent center"></div>
                    <div className="item col-20-percent center">
                      <input
                        type="text"
                        className="input--tiny"
                        placeholder="Nhập tài khoản..."
                        value={item.name}
                        onChange={(e) =>
                          handler.handleEditInputChange(
                            e,
                            i,
                            userArr,
                            setUserArr,
                            "name"
                          )
                        }
                      />
                    </div>
                    <div className="item col-20-percent center">
                      <input
                        type="text"
                        className="input--tiny"
                        placeholder="Nhập tên người dùng..."
                        value={item.username}
                        onChange={(e) =>
                          handler.handleEditInputChange(
                            e,
                            i,
                            userArr,
                            setUserArr,
                            "username"
                          )
                        }
                      />
                    </div>
                    <div className="item col-20-percent center">
                      <input
                        type="text"
                        className="input--tiny"
                        placeholder="Nhập mật khẩu..."
                        value={item.password}
                        onChange={(e) =>
                          handler.handleEditInputChange(
                            e,
                            i,
                            userArr,
                            setUserArr,
                            "password"
                          )
                        }
                      />
                    </div>
                    <div className="item col-20-percent center">
                      <input
                        type="text"
                        className="input--tiny"
                        placeholder="Nhập vai trò..."
                        value={item.role}
                        onChange={(e) =>
                          handler.handleEditInputChange(
                            e,
                            i,
                            userArr,
                            setUserArr,
                            "role"
                          )
                        }
                      />
                    </div>
                    <div className="item col-15-percent center save-btn__container">
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
            <div className="item col-5-percent center"></div>
            <div className="item col-20-percent center">
              <input
                type="text"
                className="input--tiny"
                placeholder="Nhập tên người dùng..."
              />
            </div>
            <div className="item col-20-percent center">
              <input
                type="text"
                className="input--tiny"
                placeholder="Nhập tài khoản..."
              />
            </div>
            <div className="item col-20-percent center">
              <input
                type="text"
                className="input--tiny"
                placeholder="Nhập mật khẩu..."
              />
            </div>
            <div className="item col-20-percent center">
              <input
                type="text"
                className="input--tiny"
                placeholder="Nhập vai trò..."
              />
            </div>
            <div className="item col-15-percent center save-btn__container">
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
    </ProtectedPage>
  );
};
