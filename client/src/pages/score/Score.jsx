import React from "react";
import "./Score.scss";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Confirm } from "../../components/Confirm";
import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { useHistory } from "react-router-dom";
import { schoolYear } from "../../config/data";
import { Notification } from "../../components/Notification";
import ProtectedPage from "../../components/ProtectedPage";
export const Score = () => {
  let history = useHistory();
  const [ClassDetailState, setClassDetailArrState] = useState([]);
  const [subjectArrState, setSubjectArrState] = useState([]);
  const [termArrState, setTermArrState] = useState([]);
  const [schoolYearArrState, setSchoolYearArrState] = useState([]);
  const [scoreArrState, setScoreArrState] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      const scoreArr = await api.getSubjectScore();
      const subjectArr = await api.getSubjectList();
      const termArr = await api.getTermList();
      const classArr = await api.getClassDetail();
      const UIsubjectArr = subjectArr.map((item) => {
        return {
          ...item,
          text: item.name,
        };
      });
      const UItermArr = termArr.map((item) => {
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

      const UIClassArr = classArr.map((item) => {
        return {
          ...item,
          text: item.name,
        };
      });

      setSubjectArrState(UIsubjectArr);
      setTermArrState(UItermArr);
      setSchoolYearArrState(UISchoolYearArr);
      setScoreArrState(scoreArr);
      setClassDetailArrState(UIClassArr);
    };
    getData();
  }, []);

  //Lớp sẽ hiển thị dựa theo năm học
  const onChangeSelect = () => {
    const selectedSchoolYear = document.querySelector(
      ".dropdown_selected-default"
    )
      ? document.querySelectorAll(".dropdown_selected-default")[0].innerText
      : "";
    const newClassArrState = ClassDetailState.filter(
      (item) => item.schoolYear === selectedSchoolYear
    );
    console.log("selectedSchoolYear>>>", selectedSchoolYear);
    // setClassDetailArrState(newClassArrState);
  };

  const getSelectedOptions = () => {
    let optionValues = [];
    document.querySelectorAll(".dropdown_selected-default").forEach((item) => {
      optionValues.push(item.innerText);
    });
    return optionValues;
  };

  //Xử lý khi nhấn nút tạo bảng điểm
  const handleClickCreateBtn = () => {
    const [schoolYear, className, subject, term] = getSelectedOptions();
    let subjectID = subjectArrState.find((item) => item.name === subject)._id;
    let classID = ClassDetailState.find(
      (item) => item.name === className && item.schoolYear === schoolYear
    )._id;
    let termID = termArrState.find((item) => item.name === term)._id;

    //Kiểm tra trùng
    let isExisted =
      scoreArrState.filter(
        (item) =>
          item.class === classID &&
          item.subject === subjectID &&
          item.term === termID
      ).length > 0;
    console.log(isExisted);
    if (isExisted) {
      setMessage("Điểm này đã được nhập");
      document.querySelector(
        ".notification--failed"
      ).parentElement.style.display = "flex";
    } else {
      history.push(`score/${className}/${subject}/${term}/${schoolYear}`);
    }
  };
  const handleConfirmCancelBtn = () => {
    document.querySelector(".confirm.override").style.display = "none";
  };
  const handleConfirmAcceptBtn = () => {
    const [schoolYear, className, subject, term] = getSelectedOptions();
    history.push(`score/${className}/${subject}/${term}/${schoolYear}`);
  };
  return (
    <ProtectedPage>
      <div className="score">
        <Confirm
          confirmType="override"
          result={[]}
          handleConfirmAcceptBtn={handleConfirmAcceptBtn}
          handleConfirmCancelBtn={handleConfirmCancelBtn}
        />
        <Notification status="failed" message={message} />
        <h3>Nhập điểm</h3>
        <div className="guide">
          Điền thông tin môn học cần tạo bảng điểm mới. Lưu ý điền đầy đủ các
          trường
        </div>
        <div className="grid">
          <div className="row">
            <Input
              type="select"
              // placeholder="Nhập tên lớp..."
              labelText="Năm học"
              selectName="SchoolYear"
              options={schoolYearArrState}
              onChangeSelect={onChangeSelect}
            />
          </div>
          <div className="row">
            <Input
              type="select"
              // placeholder="Nhập tên lớp..."
              labelText="Tên lớp"
              selectName="ClassName"
              options={ClassDetailState}
            />
          </div>
          <div className="row">
            <Input
              type="select"
              // placeholder="Nhập tên lớp..."
              labelText="Tên môn"
              selectName="SubjectName"
              options={subjectArrState}
            />
          </div>
          <div className="row">
            <Input
              type="select"
              // placeholder="Nhập tên lớp..."
              labelText="Học kì"
              selectName="Term"
              options={termArrState}
            />
          </div>
        </div>
        <div className="btns">
          {/* <Button
          btnType="clear"
          innerText={<Link to="/score/create-score">Tạo danh sách mới</Link>}
        /> */}
          <Button
            btnType="add"
            innerText="Tạo"
            onClick={handleClickCreateBtn}
          />
        </div>
      </div>
    </ProtectedPage>
  );
};
