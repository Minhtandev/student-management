import React from "react";
import "../student/Search.scss";
import InfoIcon from "../../assets/info-icon.png";
import EditIcon from "../../assets/edit-icon.png";
import DeleteIcon from "../../assets/Delete-icon.png";
import { GrFormAdd } from "react-icons/gr";

import { Button } from "../../components/Button";
import { Detail } from "../../components/Detail";
import { Confirm } from "../../components/Confirm";
import { Notification } from "../../components/Notification";
import { useState, useEffect } from "react";
// import { ScoreSchoolYear } from "../../config/getAPI";
import { handler, helper } from "../../handle-event/HandleEvent";
import { api } from "../../api/api";
import { schoolYear } from "../../config/data";
import * as XLSX from "xlsx";
import ProtectedPage from "../../components/ProtectedPage";
import { useParams } from "react-router-dom";
//studentArrTemp là để hiển thị, studentScoreArr là để lưu xuống CSDL

export const SearchClassDetail = () => {
  const { id } = useParams();
  const [allStudent, setAllStudent] = useState([]);
  const [studentOfClass, setStudentOfClass] = useState([]);
  const [classDetail, setClassDetail] = useState(null);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [searchStudents, setSearchStudents] = useState([]);
  const [role, setRole] = useState("");
  useEffect(() => {
    const getData = async () => {
      const studentInfoArr = await api.getStudentInfoArr();
      const classDetail = await api.getA_ClassDetail(id);
      const userFromLocal = JSON.parse(
        window.localStorage.getItem("user-qlhs")
      );

      const studentIDs = classDetail.students;
      const students =
        studentInfoArr.filter((student) => studentIDs.includes(student._id)) ||
        [];

      setStudentOfClass(students);
      setClassDetail(classDetail);
      setAllStudent(studentInfoArr);
      setSearchStudents(studentInfoArr.slice(0, 5));
      setRole(userFromLocal ? userFromLocal.role : "");
    };
    getData();
  }, []);

  const handleEvent = {
    handleConfirmToDelete: async () => {
      await api.deleteClassDetail(classDetail._id);
      helper.turnOnNotification("delete");
    },

    handleClickDeleteBtn: async (e) => {
      if (e.target.classList.contains("delete-img")) {
        let index = +e.target.parentNode.getAttribute("data-set");
        //   setResult([studentOfClass[index]]);
        //   setResultUI([
        //     {
        //       "Họ tên": studentOfClass[index].name,
        //       "Địa chỉ": studentOfClass[index].address,
        //       Email: studentOfClass[index].email,
        //       "Ngày sinh": studentOfClass[index].birth,
        //     },
        //   ]);
        //   helper.turnOnConfirm("delete");
        // }

        let studentID = studentOfClass[index]._id;
        //cập nhật UI
        const students = studentOfClass.filter(
          (student) => student._id !== studentID
        );
        setStudentOfClass(students);
        // const allStudentArrCopy = studentInfoState.filter(
        //   (studentInfo) => studentInfo._id !== studentID
        // );
        // setStudentInfoState(allStudentArrCopy);
        // const newClassDetail = classDetail;
        // newClassDetail.students = classDetail.students.filter(
        //   (student) => student !== studentID
        // );
        // let classID = classDetail._id;
        // console.log(classID, newClassDetail);
        // //cập nhật CSDL
        // await api.putClassDetail(classID, newClassDetail);
        //thông báo
        // helper.turnOnNotification("delete");
      }
    },

    // handleClickSearchBtn: () => {
    //   const classDetail = allClassDeatil.find(
    //     (classDetail) =>
    //       classDetail.name === className &&
    //       classDetail.schoolYear === schoolYear
    //   );
    //   if (classDetail) {
    //     setClassDetail(classDetail);

    //     const studentIDs = classDetail.students;
    //     const students =
    //       allStudent.filter((student) => studentIDs.includes(student._id)) ||
    //       [];
    //     setStudentOfClass(students);
    //   }
    // },

    handleClickDeleteClass: () => {
      helper.turnOnConfirm("delete");
    },

    handleClickExportBtn: () => {
      const studentsToExport = studentOfClass.map((student) => {
        return {
          "Họ tên": student.name,
          Email: student.email,
          "Ngày sinh": student.birth,
          "Giới tính": student.gender === "male" ? "Nam" : "Nữ",
          "Địa chỉ": student.address,
        };
      });
      const worksheet = XLSX.utils.json_to_sheet(studentsToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
      //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
      XLSX.writeFile(
        workbook,
        `Danh sách lớp ${classDetail?.name} ${classDetail?.schoolYear}.xlsx`
      );
    },
    handleClickUpdateBtn: () => {
      setEdit(true);
    },
    handleClickSaveBtn: async () => {
      helper.turnOnConfirm("edit");
      setEdit(false);
    },
    handleClickConfirmUpdate: async () => {
      const payloadToAPI = {
        ...classDetail,
        students: studentOfClass.map((item) => item._id),
      };

      await api.putClassDetail(classDetail._id, payloadToAPI);

      helper.turnOnNotification("edit");
    },
    handleClickAddStudent: (e) => {
      const addImgBtn = e.target.closest("button");
      let index = +addImgBtn.getAttribute("data-set");

      //Kiểm tra xem đã tồn tại học sinh trong danh sách tạm thời chưa
      const student = searchStudents[index];
      let studentID = student._id;
      let isExisting =
        studentOfClass.filter((item) => item._id === studentID).length > 0;
      ////Nếu có thì báo lỗi
      if (isExisting) {
        setMessage("Học sinh đã có trong danh sách lớp");
        document.querySelector(
          ".notification--failed"
        ).parentElement.style.display = "flex";
      }
      ////Nếu chưa có thì thêm vào studentOfClass
      else {
        setStudentOfClass([...studentOfClass, student]);
      }
    },
    handleOnChangeSearchInput: (e) => {
      const inputValue = e.target.value;
      const students = allStudent.filter((item) => {
        for (const [key, value] of Object.entries(item)) {
          if (String(value).toLowerCase().includes(inputValue.toLowerCase()))
            return true;
        }
        return false;
      });
      setSearchStudents(students.slice(0, 5));
    },
  };

  return (
    <ProtectedPage>
      <div className="search-page">
        <Detail result={resultUI} />
        <Confirm
          confirmType="delete"
          result={resultUI}
          handleConfirmCancelBtn={() => helper.turnOffConfirm("delete")}
          handleConfirmAcceptBtn={handleEvent.handleConfirmToDelete}
        />
        <Confirm
          confirmType="edit"
          result={[]}
          handleConfirmCancelBtn={() => helper.turnOffConfirm("edit")}
          handleConfirmAcceptBtn={handleEvent.handleClickConfirmUpdate}
        />
        <Notification status="failed" message={message} />

        {/***HEADER***/}
        <h3>CHI TIẾT LỚP</h3>
        {/* <div className="guide">
          Nhập tên lớp và năm học của lớp bạn muốn tìm.
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
            <div className="grid__item" style={{ margin: "0 0 32px 25px" }}>
              <Button
                btnType="update"
                innerText="Tìm"
                onClick={handleEvent.handleClickSearchBtn}
              />
            </div>
          </div>
        </div> */}

        {/***KẾT QUẢ DANH SÁCH LỚP***/}
        {/* <h4 style={{ textAlign: "center" }}>
          LỚP: {classDetail?.name} NĂM HỌC: {classDetail?.schoolYear}
        </h4> */}
        <div className="class-info">
          <h5>Tên lớp: {classDetail?.name}</h5>
          <h5>Năm học: {classDetail?.schoolYear}</h5>
          <h5>Sĩ số: {studentOfClass.length}</h5>
        </div>
        <div className="container">
          <div className="row heading">
            <div className="item col-10-percent center al-center">STT</div>
            <div className="item col-25-percent center al-left pl-70">
              Họ Tên
            </div>
            <div className="item col-25-percent center al-center">Địa chỉ</div>
            <div className="item col-15-percent center al-center">Email</div>
            <div className="item col-15-percent center al-center">
              Ngày sinh
            </div>
            <div className="item col-10-percent center al-center">
              {edit && "Thao tác"}
            </div>
          </div>

          {studentOfClass.map((item, i) => {
            return (
              <>
                <div className="row content">
                  <div className="item col-10-percent center al-center">
                    {i + 1}
                  </div>
                  <div className="item col-25-percent center al-left pl-50">
                    {item.name}
                  </div>
                  <div className="item col-25-percent center al-center">
                    {item.address}
                  </div>
                  <div className="item col-15-percent center al-center">
                    {item.email}
                  </div>
                  <div className="item col-15-percent center al-center">
                    {item.birth}
                  </div>
                  <div className="item col-10-percent center al-center">
                    {edit && (
                      <button
                        className="delete-btn"
                        data-set={i}
                        onClick={(e) => handleEvent.handleClickDeleteBtn(e)}>
                        <img src={DeleteIcon} alt="" className="delete-img" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            );
          })}
        </div>
        <div className="btns">
          {edit ? (
            <>
              <Button
                innerText="Xóa"
                btnType="cancel"
                onClick={handleEvent.handleClickDeleteClass}
              />
              <Button
                innerText="Lưu"
                btnType="save"
                onClick={handleEvent.handleClickSaveBtn}
              />
            </>
          ) : (
            <>
              <Button
                innerText="In kết quả"
                btnType="save"
                onClick={handleEvent.handleClickExportBtn}
              />

              {role !== "gv" && (
                <Button
                  innerText="Chỉnh sửa"
                  btnType="update"
                  onClick={handleEvent.handleClickUpdateBtn}
                />
              )}
            </>
          )}
        </div>

        {edit && (
          <>
            {/***THÊM HỌC SINH VÀO LỚP***/}
            <h4>Tìm tên học sinh</h4>
            <div className="guide">
              Tìm theo tên của học sinh mà bạn muốn thêm vào lớp, có thể tra cứu
              dựa trên tên, năm sinh, email, giới tính, địa chỉ.
            </div>
            <div className="grid">
              <div className="row">
                <div className="grid__item">
                  {/* <label htmlFor="">Học Sinh</label> */}
                  <input
                    onChange={(e) => handleEvent.handleOnChangeSearchInput(e)}
                    type="text"
                    placeholder="Nhập thông tin học sinh để tìm..."
                    className="search__input"
                  />
                </div>
                {/* <div className="grid__item">
            <div className="search__btns">
              <button
                className="search__button"
                onClick={handleEvent.handleClickSearchBtn}>
                Tìm kiếm
              </button>
            </div>
          </div> */}
              </div>
            </div>
            <hr></hr>
            <h4>Kết quả tìm kiếm</h4>
            <div className="container">
              <div className="row heading">
                <div className="item col-30-percent center al-left pl-70">
                  Họ Tên
                </div>
                <div className="item col-10-percent center al-center">
                  Giới Tính
                </div>
                <div className="item col-20-percent center al-center">
                  Năm Sinh
                </div>
                <div className="item col-20-percent center al-center">
                  Địa Chỉ
                </div>
                <div className="item col-20-percent center al-center">
                  Thao tác
                </div>
              </div>

              {searchStudents.map((item, i) => {
                if (item)
                  return (
                    <>
                      <div className="row content">
                        <div className="item col-30-percent center pl-50 al-left">
                          {item?.name}
                        </div>
                        <div className="item col-10-percent center al-center">
                          {item?.gender == "male" ? "Nam" : "Nữ"}
                        </div>
                        <div className="item col-20-percent center al-center">
                          {item?.birth}
                        </div>
                        <div className="item col-20-percent center al-center">
                          {item?.address}
                        </div>
                        <div className="item col-20-percent center al-center">
                          <button
                            className="search__add-btn"
                            data-set={i}
                            onClick={(e) =>
                              handleEvent.handleClickAddStudent(e)
                            }>
                            <i className="add-img">
                              <GrFormAdd></GrFormAdd>
                            </i>
                          </button>
                        </div>
                      </div>
                    </>
                  );
              })}
            </div>
          </>
        )}
      </div>
    </ProtectedPage>
  );
};

export default SearchClassDetail;
