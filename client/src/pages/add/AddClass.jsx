import React from "react";
import "./AddClass.scss";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Notification } from "../../components/Notification";
// import { classArr, schoolYearArr, gradeArr } from "../../config/getAPI";
import { useHistory } from "react-router-dom";
// import { Link } from "react-router-dom";
import { api } from "../../api/api";
import { useState, useEffect } from "react";
import { Confirm } from "../../components/Confirm";
import { schoolYear } from "../../config/data";
export const AddClass = () => {
  let history = useHistory();
  let allClass;
  const [ClassDetailState, setClassDetailArrState] = useState([]);
  const [classArrState, setClassArrState] = useState([]);
  const [gradeArrState, setGradeArrState] = useState([]);
  const [schoolYearArrState, setSchoolYearArrState] = useState([]);
  const [message, setMessage] = useState("");

  //tạo options cho select
  // const classNameArr = classArr.map((item) => {
  //   return { value: item.ID, text: item.name };
  // });
  // const nameArr = gradeArr.map((item) => {
  //   return { value: item.ID, text: item.Name };
  // });
  // const schoolYearNameArr = schoolYearArr.map((item) => {
  //   return { value: item.ID, text: item.Name };
  // });

  useEffect(() => {
    const getData = async () => {
      const gradeArr = await api.getGradeList();
      const CLASS = await api.getClassDetail();
      const classArr = await api.getClassList();
      // const schoolYearArr = await api.getSchoolYearList();
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
      // console.log(subjectArr, UIsubjectArr);
      setGradeArrState(UIgradeArr);
      // setClassArrState(UItermArr);
      setClassArrState(UIClassArr);
      allClass = UIClassArr;
      setClassDetailArrState(CLASS);
      setSchoolYearArrState(UISchoolYearArr);
    };
    getData();
  }, []);

  // useEffect(() => {
  //   console.log(document.querySelectorAll(".dropdown_selected-default")[1]);
  //   const gradeValue = document.querySelector(".dropdown_selected-default")
  //     ? document.querySelectorAll(".dropdown_selected-default")[0].innerText
  //     : "";
  //   const newClassArrState = classNameArr.filter((item) =>
  //     item.text.includes(gradeValue)
  //   );
  //   console.log("set new state");
  //   setClassArrState(newClassArrState);
  // }, [
  //   document.querySelector(".dropdown_selected-default")
  //     ? document.querySelectorAll(".dropdown_selected-default")[0].innerText
  //     : null,
  // ]);

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

  const handleClickCreateBtn = () => {
    const [grade, className, schoolYear] = getSelectedOptions();
    // console.log(className, grade);
    if (className.includes(grade)) {
      // let subjectID = subjectArrState.find(
      //   (item) => item.name === subject
      // )._id;
      // let termID = "6299d1a3197adb1f05703d97";
      // let schoolYearID = schoolYearArrState.find(
      //   (item) => item.nameSchYear === schoolYear
      // )._id;
      // console.log(classArrState);
      // let classID = ClassDetailState.find(
      //   (item) =>
      //     item.name === className && item.schoolYear === schoolYearID
      // )._id;

      let isExisted =
        ClassDetailState.filter(
          (item) => item.name === className && item.schoolYear === schoolYear
          //&& item.term === termID
        ).length > 0;
      // console.log(isExisted);
      if (isExisted) {
        document.querySelector(".confirm.override").style.display = "flex";
      } else {
        history.push(`add-class/${className}/${grade}/${schoolYear}`);
      }
    } else {
      setMessage("Lớp phải thuộc khối");
      document.querySelector(
        ".notification--failed"
      ).parentElement.style.display = "flex";
    }
  };
  const handleConfirmCancelBtn = () => {
    document.querySelector(".confirm.override").style.display = "none";
  };
  const handleConfirmAcceptBtn = () => {
    const [grade, className, schoolYear] = getSelectedOptions();
    history.push(`add-class/${className}/${grade}/${schoolYear}`);
  };

  return (
    <div className="add-class">
      <Confirm
        confirmType="override"
        result={[]}
        handleConfirmAcceptBtn={handleConfirmAcceptBtn}
        handleConfirmCancelBtn={handleConfirmCancelBtn}
      />
      <Notification status="failed" message={message} />
      <h3>Lập danh sách lớp</h3>
      <div className="guide">
        Điền thông tin lớp học mới cần tạo. Lưu ý điền đầy đủ các trường
      </div>
      <div className="grid">
        <div className="row">
          <Input
            type="select"
            labelText="Tên khối"
            selectName="name"
            options={gradeArrState}
            onChangeSelect={onChangeSelect}
          />
          <Input
            type="select"
            labelText="Tên lớp"
            selectName="ClassName"
            options={classArrState}
          />
        </div>
        <div className="row">
          <Input
            type="select"
            labelText="Năm học"
            selectName="SchoolYear"
            options={schoolYearArrState}
          />
        </div>
      </div>
      <div className="btns">
        {/* <Button
          btnType="clear"
          innerText={<Link to="/add-class/create-class">Tạo mới</Link>}
        /> */}
        <Button btnType="add" innerText="Tạo" onClick={handleClickCreateBtn} />
      </div>
    </div>
  );
};
