import React from "react";
// import { useLocation } from "react-router-dom";
// import { Search } from "../manage-score/Search";
import { studentInfoArr } from "../../config/getAPI";
import AddIcon from "../../assets/Add-icon.png";
import DeleteIcon from "../../assets/Delete-icon.png";
import { GrFormAdd } from "react-icons/gr";
import { useState, useEffect } from "react";
import "./CreateClass.scss";
import { Button } from "../../components/Button";
import { Confirm } from "../../components/Confirm";
import { Notification } from "../../components/Notification";
import { Input } from "../../components/Input";
import { api } from "../../api/api";
import { useParams } from "react-router-dom";
import { schoolYear } from "../../config/data";
import ProtectedPage from "../../components/ProtectedPage";
export const CreateClass = () => {
  const { className, grade, schoolyear } = useParams();
  let allClass;
  const [classArrState, setClassArrState] = useState([]);
  const [gradeArrState, setGradeArrState] = useState([]);
  const [schoolYearArrState, setSchoolYearArrState] = useState([]);
  const [studentArrState, setStudentArrState] = useState([]);
  const [studentArrTempState, setStudentArrTempState] = useState([]);
  const [newClassArrState, setNewClassArrState] = useState([]);
  const [result, setResult] = useState([]);
  const [allClassDetail, setAllClassDetail] = useState([]);
  const [classArr, setClassArr] = useState([]);
  const [maxTotal, setMaxTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const getData = async () => {
      const gradeArr = await api.getGradeList();
      const classArr = await api.getClassList();
      const CLASSArr = await api.getClassDetail();
      const settingList = await api.getSettingList();
      const userList = await api.getUserList();
      const user = JSON.parse(window.localStorage.getItem("user-qlhs"));
      const UIgradeArr = gradeArr.map((item) => {
        return {
          ...item,
          text: item.name,
        };
      });
      const UIClassArr = classArr.map((item) => {
        return {
          ...item,
          text: item.name,
        };
      });
      const UISchoolYearArr = schoolYear.map((item) => {
        return {
          ...item,
          text: item,
        };
      });

      const teachers = userList.filter((item) => item.role === "gv");
      const teachersName = teachers.map((item) => {
        return { value: item._id, text: item.username };
      });
      const studentArr = await api.getStudentInfoArr();
      const allClassDetailArr = await api.getClassDetail();
      setGradeArrState(UIgradeArr);
      setClassArrState(UIClassArr);
      allClass = UIClassArr;
      setSchoolYearArrState(UISchoolYearArr);
      setStudentArrState(studentArr);
      setStudentArrTempState(studentArr.slice(0, 5));
      setAllClassDetail(allClassDetailArr);
      setClassArr(CLASSArr);
      setMaxTotal(settingList.find((item) => item.name === "max-total")?.value);
      setTeachers(teachersName);
      setUserList(userList);
      setUser(user._id);
    };
    getData();
  }, []);

  //Khi thay đổi khối thì select lớp đổi theo
  const onChangeSelect = () => {
    const gradeValue = document.querySelector(".dropdown_selected-default")
      ? document.querySelectorAll(".dropdown_selected-default")[0].innerText
      : "";
    const newClassArrState = allClass.filter((item) =>
      item.text.includes(gradeValue)
    );
    console.log("set new state");
    setClassArrState(newClassArrState);
  };

  const getSelectedOptions = () => {
    let optionValues = [];
    document.querySelectorAll(".dropdown_selected-default").forEach((item) => {
      optionValues.push(item.innerText);
    });
    return optionValues;
  };

  const handleEvent = {
    handleClickChoose: async () => {
      const [selectedGrade, selectedClass, selectedSchoolYear] =
        getSelectedOptions();
      const selectedClassDetail = allClassDetail.filter(
        (item) =>
          // item.grade == selectedGradeID &&
          item.name == selectedClass && item.schoolYear == selectedSchoolYear
      )[0];
      let selectedStudents = [];
      const studentsOfSelectedCLASS = Array.from(selectedClassDetail.students);
      studentArrState.forEach(async (item) => {
        if (studentsOfSelectedCLASS.includes(item?._id)) {
          selectedStudents.push(item);
        }
      });

      const newClassArrStateCopy = [...selectedStudents, ...newClassArrState];
      setNewClassArrState(
        newClassArrStateCopy.sort((a, b) => {
          let firstNameA = a.name.split(" ").slice(-1);
          let firstNameB = b.name.split(" ").slice(-1);
          return firstNameA > firstNameB ? 1 : firstNameB > firstNameA ? -1 : 0;
        })
      );
    },
    handleChangeInput: (e) => {
      const inputValue = e.target.value;
      const studentArrStateCopy = studentArrState.filter((item) => {
        for (const [key, value] of Object.entries(item)) {
          if (String(value).toLowerCase().includes(inputValue.toLowerCase()))
            return true;
        }
        return false;
      });
      setStudentArrTempState(studentArrStateCopy);
    },
    handleClickSearchBtn: () => {
      const inputValue = document.querySelector(".search__input").value;
      const studentArrStateCopy = studentArrState.filter((item) => {
        for (const [key, value] of Object.entries(item)) {
          if (String(value).toLowerCase().includes(inputValue.toLowerCase()))
            return true;
        }
        return false;
      });
      setStudentArrTempState(studentArrStateCopy);
      document.querySelector(".search__input").value = "";
    },
    handleClickAddBtn: (e) => {
      const addBtn = e.target.closest("button");
      // console.log(e.target);
      // if (addImgEl.classList.contains("add-img")) {
      let index = +addBtn.getAttribute("data-set");
      let newClassArrStateCopy = newClassArrState;

      let newItem = studentArrTempState[index];
      //kiểm tra nếu trùng thì không thêm
      //Nếu lấy của copy sẽ bị khác giá trị con trỏ
      if (newClassArrState.includes(newItem)) {
        setMessage("Học sinh đã có trong danh sách");
        document.querySelector(
          ".notification--failed"
        ).parentElement.style.display = "flex";
      } else if (newClassArrState.length >= maxTotal) {
        setMessage("Sĩ số tối đa là " + maxTotal + " học sinh");
        document.querySelector(
          ".notification--failed"
        ).parentElement.style.display = "flex";
      } else {
        // newClassArrStateCopy.push(newItem);
        setNewClassArrState(
          [...newClassArrState, newItem].sort((a, b) => {
            let firstNameA = a.name.split(" ").slice(-1);
            let firstNameB = b.name.split(" ").slice(-1);
            return firstNameA > firstNameB
              ? 1
              : firstNameB > firstNameA
              ? -1
              : 0;
          })
        );
      }
      // }
    },
    handleClickSaveBtn: () => {
      setResult([
        {
          Lớp: className,
          Khối: grade,
          "Năm học": schoolyear,
          "Sĩ số": newClassArrState.length,
        },
      ]);
      document.querySelector(".confirm.add").style.display = "flex";
    },
    handleCancel: () => {
      document.querySelector(".confirm.add").style.display = "none";
    },
    handleConfirm: () => {
      //Lấy GVCN
      const selects = Array.from(
        document.querySelectorAll(".dropdown_selected")
      );
      const teacherSelect = selects[selects.length - 1];
      let teacherName = teacherSelect.querySelector(
        ".dropdown_selected-default"
      ).innerText;
      let teacherId =
        userList.find((item) => item.username === teacherName)?._id || "";
      // console.log("teacherId>>>>", teacherId);

      //Danh sách lớp phải lớn hơn 0
      if (newClassArrState.length > 0) {
        //Lưu xuống CSDL
        const newStudentIDs = newClassArrState.map((item) => item._id);
        console.log({
          name: className,
          schoolYear: schoolyear,
          students: newStudentIDs,
          creator: user,
          editor: user,
          formTeacher: teacherId,
        });
        api.postClassDetai({
          name: className,
          schoolYear: schoolyear,
          students: newStudentIDs,
          creator: user,
          editor: user,
          formTeacher: teacherId,
        });
        document.querySelector(".confirm.add").style.display = "none";
        //hiển thị thông báo
        document.querySelector(".notification").style.display = "flex";
      } else {
        setMessage("Lớp phải có học sinh");
        document.querySelector(
          ".notification--failed"
        ).parentElement.style.display = "flex";
      }
    },
    handleClickDeleteBtn: (e) => {
      if (e.target.classList.contains("delete-img")) {
        let index = +e.target.parentNode.getAttribute("data-set");
        let newClassArrStateCopy = newClassArrState.filter(
          (item, i) => i !== index
        );
        setNewClassArrState(
          newClassArrStateCopy.sort((a, b) => {
            let firstNameA = a.name.split(" ").slice(-1);
            let firstNameB = b.name.split(" ").slice(-1);
            return firstNameA > firstNameB
              ? 1
              : firstNameB > firstNameA
              ? -1
              : 0;
          })
        );
      }
    },
  };

  return (
    <ProtectedPage>
      <div className="create-class create-class-screen">
        <div className="search-page">
          {/* <Detail result={result} /> */}
          <Confirm
            confirmType="add"
            result={result}
            handleConfirmCancelBtn={handleEvent.handleCancel}
            handleConfirmAcceptBtn={handleEvent.handleConfirm}
          />

          <Notification status="failed" message={message} />
          {/* <Detail /> */}
          <h3>Lập danh sách lớp</h3>
          <h4>Chọn từ danh sách lớp đã có</h4>
          <div className="guide">
            Chọn lớp học đã có mà bạn muốn lấy danh sách học sinh
          </div>
          <div className="grid">
            <div className="row">
              {/* chọn lớp đã có */}
              <div className="grid__item option__input">
                <Input
                  type="select"
                  labelText="Tên khối"
                  selectName="name"
                  options={gradeArrState}
                  onChangeSelect={onChangeSelect}
                />
              </div>
              <div className="grid__item option__input">
                <Input
                  type="select"
                  labelText="Tên lớp"
                  selectName="ClassName"
                  options={classArrState}
                />
              </div>
            </div>
            <div className="row">
              <div className="grid__item option__input">
                <Input
                  type="select"
                  labelText="Năm học"
                  selectName="SchoolYear"
                  options={schoolYearArrState}
                />
              </div>
              <div className="grid__item option__input">
                <div className="search__btns">
                  <button
                    className="search__button"
                    onClick={handleEvent.handleClickChoose}>
                    Chọn
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr></hr>
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
                  onChange={(e) => handleEvent.handleChangeInput(e)}
                  type="text"
                  placeholder="Nhập thông tin học sinh để tìm..."
                  className="search__input"
                />
              </div>
              <div className="grid__item">
                <div className="search__btns">
                  <button
                    className="search__button"
                    onClick={handleEvent.handleClickSearchBtn}>
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr></hr>
          <h4>Kết quả tìm kiếm</h4>
          <div className="container">
            <div className="row heading">
              <div className="item col-30-percent center al-center">Họ Tên</div>
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
            {studentArrTempState.length === 0 && (
              <span style={{ paddingLeft: "15px" }}>
                Không tìm thấy học sinh
              </span>
            )}
            {studentArrTempState.map((item, i) => {
              if (item)
                return (
                  <>
                    <div className="row content">
                      <div className="item col-30-percent center al-center">
                        {item.name}
                      </div>
                      <div className="item col-10-percent center al-center">
                        {item.gender == "male" ? "Nam" : "Nữ"}
                      </div>
                      <div className="item col-20-percent center al-center">
                        {item.birth}
                      </div>
                      <div className="item col-20-percent center al-center">
                        {item.address}
                      </div>
                      <div className="item col-20-percent center al-center">
                        <button
                          className="search__add-btn"
                          data-set={i}
                          onClick={(e) => handleEvent.handleClickAddBtn(e)}>
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
        </div>
        <hr></hr>
        <div className="new-class">
          <h4>Danh sách lớp đang lập</h4>
          <div className="class-info">
            <h5>Tên lớp: {className}</h5>
            <h5>Tên khối: {grade}</h5>
            <h5>Năm học: {schoolyear}</h5>
            <h5>Sĩ số: {newClassArrState.length}</h5>
          </div>
          <Input
            type="select"
            labelText="Giáo viên chủ nhiệm"
            name="gender"
            selectName="gender"
            options={teachers}
          />
          <div className="container">
            <div className="row heading">
              <div className="item col-5-percent center al-center">STT</div>
              <div className="item col-25-percent center al-center">Họ Tên</div>
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

            {newClassArrState.map((item, i) => {
              return (
                <>
                  <div className="row content">
                    <div className="item col-5-percent center al-center">
                      {i + 1}
                    </div>
                    <div className="item col-25-percent center al-center">
                      {item.name}
                    </div>
                    <div className="item col-10-percent center al-center">
                      {item.gender == "male" ? "Nam" : "Nữ"}
                    </div>
                    <div className="item col-20-percent center al-center">
                      {item.birth}
                    </div>
                    <div className="item col-20-percent center al-center">
                      {item.address}
                    </div>
                    <div className="item col-20-percent center al-center">
                      <button
                        className="new-class__delete-btn"
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
            <Button
              btnType="save"
              innerText="Lưu"
              onClick={handleEvent.handleClickSaveBtn}></Button>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};
