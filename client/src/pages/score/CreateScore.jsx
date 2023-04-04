import React from "react";
import "./CreateScore.scss";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Confirm } from "../../components/Confirm";
import { Notification } from "../../components/Notification";
import { useState, useEffect } from "react";
import { helper } from "../../handle-event/HandleEvent";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
// import { schoolYear as schoolYearArr } from "../../config/data";
//get từ DS lớp, giữ lại id của HS
export const CreateScore = () => {
  const { className, subject, term, schoolYear } = useParams();
  const [status, setstatus] = useState("input");
  const [message, setMessage] = useState("");
  const [finalResult, setFinalResult] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [scoreSubjectState, setScoreSubjectState] = useState([]);
  const [classIDState, setClassIDState] = useState("");
  const [subjectIDState, setSubjectIDState] = useState("");
  const [termIDState, setTermIDState] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(10);
  const [param15ID, setParam15ID] = useState("");
  const [param15Value, setParam15Value] = useState(1);
  const [param1ID, setParam1ID] = useState("");
  const [param1Value, setParam1Value] = useState(2);

  useEffect(() => {
    const getData = async () => {
      const classArr = await api.getClassDetail();
      const classDetail = classArr.find(
        (item) => item.schoolYear == schoolYear && item.name == className
      );
      let classID = classDetail._id;
      const studentsOfClass = classDetail.students;

      const subjectArr = await api.getSubjectList();
      let subjectID = subjectArr.find((item) => item.name == subject)._id;

      const termArr = await api.getTermList();
      let termID = termArr.find((item) => item.name === term)._id;

      const paramArr = await api.getParamList();
      let param15 = paramArr.find((item) => item.name == "15 phút");
      let param1 = paramArr.find((item) => item.name == "1 tiết");
      // let paramTermID = paramArr.find((item) => item.name == "học kì")._id;

      const settingList = await api.getSettingList();
      let min = settingList.find((item) => item.name == "min-score");
      let max = settingList.find((item) => item.name == "min-score");

      const allStudents = await api.getStudentInfoArr();
      const newStudentList = allStudents.filter((item) =>
        studentsOfClass.includes(item._id)
      );

      const scoreArr = await api.getSubjectScore();

      setClassIDState(classID);
      setSubjectIDState(subjectID);
      setTermIDState(termID);
      setParam15ID(param15._id);
      setParam1ID(param1._id);
      setParam15Value(param15.value);
      setParam1Value(param1.value);
      setMinScore(min);
      setMaxScore(max);
      setStudentList(newStudentList);
      setScoreSubjectState(scoreArr);
    };
    getData();
  }, []);

  const handleClickAddBtn = () => {
    const finalResultTemp = [];
    const inputs15 = Array.from(document.querySelectorAll(".min-15 input"));
    const inputs15Min = inputs15.map((input) =>
      input.value.trim().replace(/\s+/g, " ")
    );
    const inputs1 = Array.from(document.querySelectorAll(".per-1 input"));
    const inputs1Per = inputs1.map((input) =>
      input.value.trim().replace(/\s+/g, " ")
    );

    studentList.forEach((item, i) => {
      let total15Min = inputs15Min[i]
        .split(" ")
        .map((item) => Number(item))
        .reduce((total, num) => total + num * param15Value, 0);
      let total1Per = inputs1Per[i]
        .split(" ")
        .map((item) => Number(item))
        .reduce((total, num) => total + num * param1Value, 0);
      let totalParam =
        inputs15Min[i].split(" ").length * param15Value +
        inputs1Per[i].split(" ").length * param1Value;
      const newItem = {
        ...item,
        score15Min: inputs15Min[i],
        score1Per: inputs1Per[i],
        avgScore: ((total15Min + total1Per) / totalParam).toFixed(2),
      };

      finalResultTemp.push(newItem);
    });
    //kiểm tra ràng buộc dữ liệu
    let checkEmptyMessage = "ok";
    let checkNumberMessage = "ok";
    let checkScoreMessage = "ok";
    // finalResultTemp.forEach((item) => {
    //   if (helper.validateData("empty", item) !== "ok")
    //     checkEmptyMessage = helper.validateData("empty", item);
    //   if (
    //     helper.validateData("number", {
    //       score15Min: item.score15Min.replace(" ", ""),
    //       score1Per: item.score1Per.replace(" ", ""),
    //     }) !== "ok"
    //   )
    //     checkNumberMessage = helper.validateData("number", {
    //       score15Min: item.score15Min.replace(" ", ""),
    //       score1Per: item.score1Per.replace(" ", ""),
    //     });
    //   if (
    //     helper.validateData(
    //       "score",
    //       {
    //         score15Min: item.score15Min,
    //         score1Per: item.score1Per,
    //       },
    //       null,
    //       null,
    //       null,
    //       minScore,
    //       maxScore
    //     ) !== "ok"
    //   )
    //     checkScoreMessage = helper.validateData(
    //       "score",
    //       {
    //         score15Min: item.score15Min,
    //         score1Per: item.score1Per,
    //       },
    //       null,
    //       null,
    //       null,
    //       minScore,
    //       maxScore
    //     );
    // });
    const checkMessageArr = [
      checkEmptyMessage,
      checkNumberMessage,
      checkScoreMessage,
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
      console.log(finalResultTemp);
      setFinalResult(finalResultTemp);
      setstatus("confirm");
    }
  };

  const handleClickSaveBtn = () => {
    document.querySelector(".confirm.add").style.display = "flex";
  };
  const handleConfirmAcceptBtn = () => {
    //Lưu xuống CSDL
    const payloadToApi = finalResult.map((item) => {
      return {
        student: item._id,
        class: classIDState,
        subject: subjectIDState,
        term: termIDState,
        scores: [
          ...item.score15Min
            .trim()
            .split(" ")
            .map((item) => {
              return {
                param: param15ID,
                value: Number(item),
              };
            }),
          ...item.score1Per
            .trim()
            .split(" ")
            .map((item) => {
              return {
                param: param1ID,
                value: Number(item),
              };
            }),
        ],
        avg: Number(item.avgScore),
      };
    });

    console.log("payloadToApi>>>", payloadToApi);

    payloadToApi.forEach((item) => api.postSubjectScore(item));
    document.querySelector(".notification").style.display = "flex";
    document.querySelector(".confirm.add").style.display = "none";
  };
  const handleConfirmCancelBtn = () => {
    document.querySelector(".confirm.add").style.display = "none";
  };
  return (
    <>
      <Confirm
        confirmType="add"
        result={[]}
        handleConfirmAcceptBtn={handleConfirmAcceptBtn}
        handleConfirmCancelBtn={handleConfirmCancelBtn}
      />
      <Notification status="failed" message={message} />

      {status == "input" ? (
        <div className="create-score">
          <h3>Tạo bảng điểm</h3>
          <div className="guide">
            Nhập đầy đủ từng cột điểm cho từng học sinh. Điểm trung bình sẽ được
            tính tự động. Nếu có nhiều cột điểm, ngăn với nhau bằng dấu cách "
            ".
          </div>
          <div className="score-info">
            <h4>Lớp: {className}</h4>
            <h4>{term}</h4>
            <h4>Năm học: {schoolYear}</h4>
            <h4>Môn học: {subject}</h4>
          </div>
          <div className="container">
            <div className="row heading">
              <div className="item col-10-percent center al-center">STT</div>
              <div className="item col-30-percent center al-left pl-50">
                Họ Tên
              </div>
              <div className="item col-20-percent center al-center">
                Điểm 15'
              </div>
              <div className="item col-20-percent center al-center">
                Điểm 1 tiết
              </div>
              <div className="item col-20-percent center al-center">
                Điểm TB
              </div>
            </div>
            {studentList.map((item, i) => (
              <div className="row content">
                <div className="item col-10-percent center al-center">
                  {i + 1}
                </div>
                <div className="item col-30-percent center al-left pl-50">
                  {item.name}
                </div>
                <div className="item col-20-percent center al-center min-15">
                  <Input type="small" placeholder="Nhập điểm 15'..." />
                </div>
                <div className="item col-20-percent center al-center per-1">
                  <Input type="small" placeholder="Nhập điểm 1 tiết..." />
                </div>
                <div className="item col-20-percent center al-center">
                  {/* {avgScore[i]} */}
                </div>
              </div>
            ))}
          </div>
          <div className="btns">
            <Button innerText="Tạo" btnType="add" onClick={handleClickAddBtn} />
          </div>
        </div>
      ) : (
        <div className="create-score">
          <h3>Tạo bảng điểm</h3>
          <div className="guide">
            Nhập đầy đủ từng cột điểm cho từng học sinh. Điểm trung bình sẽ được
            tính tự động
          </div>
          <div className="score-info">
            <h4>Lớp: {className}</h4>
            <h4>Học kỳ: {term}</h4>
            <h4>Năm học: {schoolYear}</h4>
            <h4>Môn học: {subject}</h4>
          </div>
          <div className="container">
            <div className="row heading">
              <div className="item col-10-percent center al-center">STT</div>
              <div className="item col-30-percent center al-left pl-70">
                Họ Tên
              </div>
              <div className="item col-20-percent center al-center">
                Điểm 15'
              </div>
              <div className="item col-20-percent center al-center">
                Điểm 1 tiết
              </div>
              <div className="item col-20-percent center al-center">
                Điểm TB
              </div>
            </div>
            {studentList.map((item, i) => (
              <div className="row content">
                <div className="item col-10-percent center al-center">
                  {i + 1}
                </div>
                <div className="item col-30-percent center al-left pl-50">
                  {item.name}
                </div>
                <div className="item col-20-percent center al-center min-15">
                  {finalResult[i].score15Min}
                </div>
                <div className="item col-20-percent center al-center per-1">
                  {finalResult[i].score1Per}
                </div>
                <div className="item col-20-percent center al-center">
                  {finalResult[i].avgScore}
                </div>
              </div>
            ))}
          </div>
          <div className="btns">
            <Button
              innerText="Lưu"
              btnType="save"
              onClick={handleClickSaveBtn}
            />
          </div>
        </div>
      )}
    </>
  );
};
