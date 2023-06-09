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
import ProtectedPage from "../../components/ProtectedPage";
import axios from "axios";
//studentArrTemp là để hiển thị, studentScoreArr là để lưu xuống CSDL
import * as XLSX from "xlsx";

export const SearchStudent = () => {
  const [studentInfoState, setStudentInfoState] = useState([]);
  const [studentArrTempState, setStudentArrTempState] = useState([]);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [user, setUser] = useState("");
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const studentInfoArr = await api.getStudentInfoArr();
      const userList = await api.getUserList();
      const userFromLocal = JSON.parse(
        window.localStorage.getItem("user-qlhs")
      );
      const settingList = await api.getSettingList();

      let min = settingList.find((item) => item.name === "min-age")?.value;
      let max = settingList.find((item) => item.name === "max-age")?.value;
      setMinAge(Number(min));
      setMaxAge(Number(max));
      setStudentInfoState(
        studentInfoArr.sort((a, b) => {
          let firstNameA = a.name.split(" ").slice(-1);
          let firstNameB = b.name.split(" ").slice(-1);
          return firstNameA > firstNameB ? 1 : firstNameB > firstNameA ? -1 : 0;
        })
      );
      setStudentArrTempState(
        studentInfoArr.sort((a, b) => {
          let firstNameA = a.name.split(" ").slice(-1);
          let firstNameB = b.name.split(" ").slice(-1);
          return firstNameA > firstNameB ? 1 : firstNameB > firstNameA ? -1 : 0;
        })
      );
      setRole(userFromLocal ? userFromLocal.role : "");
      setUser(userFromLocal ? userFromLocal._id : "");
      setUserList(userList);
    };
    getData();
  }, []);

  const getNameOfUser = (id) => {
    const user = userList.find((item) => item._id === id);
    if (user) return user.name;
    else return "";
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "xfubk0t8");

    return axios.post(
      "https://api.cloudinary.com/v1_1/djt9g7wvi/image/upload",
      formData
    );
  };

  const getDate = (date) => {
    const dateObj = new Date(date);
    let month = dateObj.getMonth() + 1; //months from 1-12
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    return day + "/" + month + "/" + year;
  };

  const handleEvent = {
    onClickExport: () => {
      //convert data to data UI
      const UIdata = studentArrTempState.map((student) => {
        return {
          "Họ tên": student.name,
          Email: student.email,
          Ảnh: student.image,
          "Ngày sinh": student.birth,
          "Giới tính": student.gender === "male" ? "Nam" : "Nữ",
          "Địa chỉ": student.address,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(UIdata);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      let today = new Date();
      let time = today.toTimeString().split(":").join("").substr(0, 4);
      let timestamp = helper.getTimestamp("yyyymmdd", today) + "" + time;

      XLSX.writeFile(workbook, `Danh sách học sinh ${timestamp}.xlsx`);
    },
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
      setStudentInfoState(
        allStudentArrCopy.sort((a, b) => {
          let firstNameA = a.name.split(" ").slice(-1);
          let firstNameB = b.name.split(" ").slice(-1);
          return firstNameA > firstNameB ? 1 : firstNameB > firstNameA ? -1 : 0;
        })
      );

      //cập nhật CSDL
      await api.deleteStudent(studentID);

      //thông báo
      helper.turnOnNotification("delete");
    },
    handleConfirmToEdit: async () => {
      //kiểm tra ràng buộc dữ liệu
      let checkEmptyMessage = helper.validateData("empty", result[0]);
      let checkAgeMessage = helper.validateData(
        "age",
        {
          birth: result[0].birth,
        },
        null,
        minAge,
        maxAge
      );
      let checkEmailMessage = helper.validateData("email", {
        email: result[0].email,
      });
      const checkMessageArr = [
        checkEmptyMessage,
        checkAgeMessage,
        checkEmailMessage,
      ];
      let isValid = checkMessageArr.filter((item) => item !== "ok").length == 0;

      if (!isValid) {
        //lấy thông báo thất bại đầu tiên
        const firstFailedMessage = checkMessageArr.filter(
          (item) => item !== "ok"
        )[0];
        setMessage(firstFailedMessage);
        document.querySelector(
          ".notification--failed"
        ).parentElement.style.display = "flex";
      } else {
        //   //cập nhật ở UI
        // let index = window.localStorage.getItem("index");
        let index = result[0].index;
        const studentArrCopy = helper.generateArrCopy(studentArrTempState);
        studentArrCopy[index] = result[0];
        studentArrCopy[index].Edit = false;
        setStudentArrTempState(studentArrCopy);

        //   //cập nhật ở mảng dữ liệu
        let studentID = studentArrCopy[index]._id;
        await api.putStudentInfo(studentID, studentArrCopy[index]);
        helper.turnOnNotification("edit");
      }
    },
    handleSaveBtn: (e) => {
      let studentArrStateCopy = JSON.parse(JSON.stringify(studentArrTempState));
      let index = +e.target.getAttribute("data-set");
      let inputs = e.target.closest(".row").querySelectorAll("input");
      let newImageLink = inputs[2].getAttribute("data-set");

      let newValue = {
        ...studentArrStateCopy[index],
        index: index,
        editor: user,
        name: inputs[0].value,
        address: inputs[4].value,
        email: inputs[3].value,
        birth: inputs[1].value,
        image: newImageLink || studentArrStateCopy[index].image,
      };
      setResult([newValue]);
      setResultUI([
        {
          "Họ tên": newValue.name,
          "Địa chỉ": newValue.address,
          Email: newValue.email,
          "Ngày sinh": newValue.birth,
          Ảnh: newImageLink || studentArrStateCopy[index].image,
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
    <ProtectedPage>
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
            <div className="item col-10-percent center al-center">Mã HS</div>
            <div className="item col-15-percent center al-center">Họ Tên</div>
            <div className="item col-15-percent center al-center">
              Ngày sinh
            </div>
            <div className="item col-15-percent center al-center">Hình ảnh</div>
            <div className="item col-15-percent center al-center">Email</div>
            <div className="item col-20-percent center al-center">Địa chỉ</div>
            {role !== "gv" && (
              <div className="item col-10-percent center al-center">
                Thao tác
              </div>
            )}
          </div>
          {studentArrTempState.length === 0 && (
            <span style={{ paddingLeft: "15px" }}>Không tìm thấy học sinh</span>
          )}
          {studentArrTempState.map((item, i) => {
            return (
              <>
                <div className="row content">
                  <div className="item col-10-percent center al-center">
                    {item.ID}
                  </div>
                  <div className="item col-15-percent center al-center">
                    {item.name}
                  </div>
                  <div className="item col-15-percent center al-center">
                    {item.birth}
                  </div>
                  <div className="item col-15-percent center al-center img__container">
                    <img
                      src={item.image}
                      className="item__image"
                      alt="Chưa có ảnh"
                      width="100px"
                    />
                  </div>
                  <div className="item col-15-percent center al-center">
                    {item.email}
                  </div>
                  <div className="item col-20-percent center al-center">
                    {item.address}
                  </div>
                  {role !== "gv" && (
                    <div className="item col-10-percent center al-center">
                      <button
                        className="info-btn"
                        data-set={i}
                        onClick={(e) => {
                          setResultUI([
                            {
                              "Mã HS": item.ID,
                              "Họ và tên": item.name,
                              "Giới tính":
                                item.gender === "male" ? "Nam" : "Nữ",
                              "Địa chỉ": item.address,
                              Email: item.email,
                              "Ngày sinh": item.birth,
                              Ảnh: item.image,
                              "Thời gian nhập học": getDate(item.createdAt),
                              "Thời gian chỉnh sửa": getDate(item.updatedAt),
                              "Người tạo": getNameOfUser(item.creator),
                              "Người chỉnh sửa": getNameOfUser(item.editor),
                            },
                          ]);
                          document.querySelector(".detail").style.display =
                            "flex";
                        }}>
                        <img src={InfoIcon} alt="" className="info-img" />
                      </button>
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
                  )}
                </div>
                {item.Edit ? (
                  <div className="row content">
                    <div className="item col-10-percent center al-center">
                      {item.ID}
                    </div>
                    <div className="item col-15-percent center al-center">
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
                    <div className="item col-15-percent center al-center">
                      <input
                        type="text"
                        className="input--small"
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
                    <div className="item col-15-percent center al-center">
                      <input
                        type="file"
                        className="input--small"
                        onChange={(e) => {
                          //1. Upload ảnh
                          uploadImage(e.target.files[0]).then((res) => {
                            let imageLink = res.data.secure_url;
                            console.log("url ảnh>>>>", imageLink);
                            // setImageLink(imageLink);
                            //2. Hiển thị ảnh
                            const studentArrCopy =
                              helper.generateArrCopy(studentArrTempState);
                            studentArrCopy[i].image = imageLink;
                            setStudentArrTempState(studentArrCopy);
                            //3. Đưa link ảnh vào attribute của input này
                            e.target.setAttribute("data-set", imageLink);
                          });
                        }}
                      />
                    </div>
                    <div className="item col-15-percent center al-center">
                      <input
                        type="text"
                        className="input--small"
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
                        className="input--small"
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
          <Button
            innerText="In kết quả"
            btnType="export"
            onClick={handleEvent.onClickExport}
          />
        </div>
      </div>
    </ProtectedPage>
  );
};
