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
import { useHistory } from "react-router-dom";
import * as XLSX from "xlsx";
import ProtectedPage from "../../components/ProtectedPage";
import { UncontrolledTooltip } from "reactstrap";
//get từ DS lớp, giữ lại id của HS
const ScoreDetail = () => {
  const history = useHistory();
  const { className, subject, term, schoolYear } = useParams();
  const [status, setstatus] = useState("view");
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
  const [user, setUser] = useState(null);
  const [creatorID, setCreatorID] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      //reset localstorage
      window.localStorage.setItem("score-page", "");

      //Lấy user
      let userFromLocal = JSON.parse(window.localStorage.getItem("user-qlhs"));
      console.log("userFromLocal >>>", userFromLocal);
      const classArr = await api.getClassDetail();
      const classDetail = classArr.find(
        (item) => item.schoolYear == schoolYear && item.name == className
      );
      let classID = classDetail._id;
      const studentsOfClass = classDetail.students;
      const userList = await api.getUserList();

      const subjectArr = await api.getSubjectList();
      let subjectID = subjectArr.find((item) => item.name == subject)._id;

      const termArr = await api.getTermList();
      let termID = termArr.find((item) => item.name === term)._id;

      const paramArr = await api.getParamList();
      let param15 = paramArr.find((item) => item.name == "15 phút");
      let param1 = paramArr.find((item) => item.name == "1 tiết");
      // let paramTermID = paramArr.find((item) => item.name == "học kì")._id;

      const settingList = await api.getSettingList();
      let min = settingList.find((item) => item.name == "min-score")?.value;
      let max = settingList.find((item) => item.name == "max-score")?.value;

      const allStudents = await api.getStudentInfoArr();
      const newStudentList = allStudents.filter((item) =>
        studentsOfClass.includes(item._id)
      );

      const scoreArr = await api.getSubjectScore();

      //Khi bấm chuyển sang edit thì input có sẵn giá trị
      // if (status === "input") {
      //   let isEditActivated = window.localStorage.getItem("score-page");
      //   if (isEditActivated) {
      //     const rows = document.querySelectorAll(".row.content");
      //     console.log("rows>>>", rows);
      //     rows.forEach((row, i) => {
      //       const inputs = row.querySelectorAll("input");
      //       inputs[0].value = finalResult[i]?.score15Min;
      //       inputs[1].value = finalResult[i]?.score1Per;
      //     });
      //   }
      // }

      if (status === "view") {
        setFinalResult(
          newStudentList.map((student) => {
            //1. Lấy điểm môn học này của học sinh này
            const subjectScore = scoreArr.find(
              (item) =>
                item.student === student._id &&
                item.class === classID &&
                item.subject === subjectID &&
                item.term === termID
            );
            const scores = subjectScore ? subjectScore.scores : [];

            //2. Lấy điểm 15 phút và join lại
            const score15JoinString = scores
              .filter((item) => item.param === param15._id)
              .map((item) => item.value)
              .join(" ");

            //3. Lấy điểm 1 tiết và join lại
            const score1JoinString = scores
              .filter((item) => item.param === param1._id)
              .map((item) => item.value)
              .join(" ");

            return {
              ...student,
              scoreID: subjectScore?._id,
              score15Min: score15JoinString,
              score1Per: score1JoinString,
              avgScore: subjectScore?.avg,
            };
          })
        );

        const subjectScore = scoreArr.filter(
          (item) =>
            item.class === classID &&
            item.subject === subjectID &&
            item.term === termID
        )[0];
        let userID = subjectScore?.creator;
        setCreatorID(userID);
        console.log("userID>>>>:", userID);
      }

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
      setUser(userFromLocal);
      setUserList(userList);
    };
    getData();
  }, []);

  useEffect(() => {
    const updateStatus = () => {
      if (status === "input") {
        let isEditActivated = window.localStorage.getItem("score-page");
        if (isEditActivated) {
          const rows = document.querySelectorAll(".row.content");
          console.log("rows>>>", rows);
          rows.forEach((row, i) => {
            const inputs = row.querySelectorAll("input");
            inputs[0].value = finalResult[i]?.score15Min;
            inputs[1].value = finalResult[i]?.score1Per;
          });
        }
      }

      //Nếu đã có điểm thì hiển thị điểm đã có
      // if (status === "view") {
      //   setFinalResult(
      //     studentList.map((student) => {
      //       //1. Lấy điểm môn học này của học sinh này
      //       const subjectScore = scoreSubjectState.find(
      //         (item) =>
      //           item.student === student._id &&
      //           item.class === classIDState &&
      //           item.subject === subjectIDState &&
      //           item.term === termIDState
      //       );
      //       const scores = subjectScore ? subjectScore.scores : [];

      //       //2. Lấy điểm 15 phút và join lại
      //       const score15JoinString = scores
      //         .filter((item) => item.param === param15ID)
      //         .map((item) => item.value)
      //         .join(" ");

      //       //3. Lấy điểm 1 tiết và join lại
      //       const score1JoinString = scores
      //         .filter((item) => item.param === param1ID)
      //         .map((item) => item.value)
      //         .join(" ");

      //       return {
      //         ...student,
      //         scoreID: subjectScore?._id,
      //         score15Min: score15JoinString,
      //         score1Per: score1JoinString,
      //         avgScore: subjectScore?.avg,
      //       };
      //     })
      //   );

      //   const subjectScore = scoreSubjectState.filter(
      //     (item) =>
      //       item.class === classIDState &&
      //       item.subject === subjectIDState &&
      //       item.term === termIDState
      //   )[0];
      //   let userID = subjectScore?.user;
      //   setCreatorID(userID);
      //   console.log("userID>>>>:", userID);
      // }
    };
    updateStatus();
  }, [status]);

  const getNameOfUser = (id) => {
    const user = userList.find((item) => item._id === id);
    if (user) return user.name;
    else return "";
  };

  const getDate = (date) => {
    const dateObj = new Date(date);
    let month = dateObj.getMonth() + 1; //months from 1-12
    let day = dateObj.getDate();
    let year = dateObj.getFullYear();
    return day + "/" + month + "/" + year;
  };

  const handleClickAddBtn = () => {
    const finalResultTemp = [];
    const inputs15 = Array.from(document.querySelectorAll(".min-15 input"));
    //Đưa định dạng mỗi số cách 1 cái
    const inputs15Min = inputs15.map((input) =>
      input.value.trim().replace(/\s+/g, " ")
    );
    const inputs1 = Array.from(document.querySelectorAll(".per-1 input"));
    const inputs1Per = inputs1.map((input) =>
      input.value.trim().replace(/\s+/g, " ")
    );

    //Neu da co final result roi
    if (finalResult.length > 0) {
      finalResult.forEach((item, i) => {
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

        console.log("push to final result>>>", newItem);
        finalResultTemp.push(newItem);
      });
    } else {
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

        console.log("push to final result>>>", newItem);
        finalResultTemp.push(newItem);
      });
    }
    //kiểm tra ràng buộc dữ liệu
    let checkEmptyMessage = "ok";
    let checkNumberMessage = "ok";
    let checkScoreMessage = "ok";
    finalResultTemp.forEach((item) => {
      if (helper.validateData("empty", item) !== "ok")
        checkEmptyMessage = helper.validateData("empty", item);

      //Bỏ tất cả space
      if (
        helper.validateData("number", {
          score15Min: item.score15Min.trim().replace(/\s+/g, ""),
          score1Per: item.score1Per.trim().replace(/\s+/g, ""),
        }) !== "ok"
      )
        checkNumberMessage = helper.validateData("number", {
          score15Min: item.score15Min.trim().replace(/\s+/g, ""),
          score1Per: item.score1Per.trim().replace(/\s+/g, ""),
        });
      if (
        helper.validateData(
          "score",
          {
            score15Min: item.score15Min,
            score1Per: item.score1Per,
          },
          null,
          null,
          null,
          minScore,
          maxScore
        ) !== "ok"
      )
        checkScoreMessage = helper.validateData(
          "score",
          {
            score15Min: item.score15Min,
            score1Per: item.score1Per,
          },
          null,
          null,
          null,
          minScore,
          maxScore
        );
    });
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
  const handleConfirmAcceptBtn = async () => {
    //Lưu xuống CSDL
    const payloadToApi = finalResult.map((item) => {
      return {
        editor: user._id,
        scoreID: item.scoreID,
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

    //Xem đã có điểm đó chưa
    let isEditActivated =
      window.localStorage.getItem("score-page") == "activated";

    payloadToApi.forEach(async (item, i) => {
      if (isEditActivated && item.scoreID) {
        await api.putSubjectScore(item.scoreID, item);
      } else {
        await api.postSubjectScore({ ...item, creator: user._id });
      }
    });

    // if (isEditActivated) {
    //   payloadToApi.forEach(
    //     async (item, i) => await api.putSubjectScore(item.scoreID, item)
    //   );
    // } else {
    //   payloadToApi.forEach(async (item) => await api.postSubjectScore(item));
    // }

    //update điểm học kì
    const allTermScore = await api.getTermScores();
    const allSubjectScore = await api.getSubjectScore();
    payloadToApi.forEach(async (item) => {
      //tìm score có tồn tại chưa
      const termScore = allTermScore.find(
        (score) =>
          item.student === score.student &&
          item.class === score.class &&
          item.term === score.term
      );

      //Lấy điểm môn học vừa thêm
      const subjectScore = allSubjectScore.find(
        (score) =>
          item.student === score.student &&
          item.class === score.class &&
          item.term === score.term &&
          item.subject === score.subject
      );

      let subjectScoreID = subjectScore?._id;
      let subjectScoreAvg = subjectScore?.avg;

      //Nếu tồn tại, update phần điểm lại
      if (termScore) {
        const subjectScores = termScore.subjectScores;
        let numberOFSubjects = subjectScores.length;
        let termAvg = termScore.avg;
        const payloadToTermScore = {
          ...termScore,
          subjectScores: [...subjectScores, subjectScoreID],
          avg: (
            (numberOFSubjects * termAvg + subjectScoreAvg) /
            (numberOFSubjects + 1)
          ).toFixed(2),
        };

        await api.putTermScore(termScore._id, payloadToTermScore);
      }
      //Nếu chưa tồn tại, tạo mới điểm học kì
      else {
        const payloadToTermScore = {
          student: item.student,
          class: item.class,
          term: item.term,
          subjectScores: [subjectScoreID],
          avg: subjectScoreAvg.toFixed(2),
        };

        await api.postTermScore(payloadToTermScore);
      }
    });

    document.querySelector(".notification").style.display = "flex";
    document.querySelector(".confirm.add").style.display = "none";
    // history.push(`/score/${className}/${subject}/${term}/${schoolYear}/view`);
    // window.reload();
    setstatus("view");
  };
  const handleConfirmCancelBtn = () => {
    document.querySelector(".confirm.add").style.display = "none";
  };

  const onClickExport = () => {
    const scoreToExport = finalResult.map((item) => {
      return {
        "Họ tên": item.name,
        "Điểm 15 phút": item.score15Min,
        "Điểm 1 tiết": item.score1Per,
        "Điểm trung bình": item.avgScore,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(scoreToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

    let today = new Date();
    let time = today.toTimeString().split(":").join("").substr(0, 4);
    let timestamp = helper.getTimestamp("yyyymmdd", today) + "" + time;
    XLSX.writeFile(
      workbook,
      `Bảng điểm môn ${subject.toLowerCase()} lớp ${className} ${term.toLowerCase()} năm học ${schoolYear} ${timestamp}.xlsx`
    );
  };

  const onClickUpdateBtn = () => {
    setstatus("input");
    window.localStorage.setItem("score-page", "activated");
  };

  const handleClickDeleteBtn = () => {
    document.querySelector(".confirm.delete").style.display = "flex";
  };

  const handleCancelDeleteBtn = () => {
    document.querySelector(".confirm.delete").style.display = "none";
  };

  const handleConfirmDeleteBtn = () => {
    console.log("studentList>>>", finalResult);

    finalResult.forEach(async (item) => {
      await api.deleteSubjectScore(item.scoreID);
    });

    document.querySelector(".notification").style.display = "flex";
    document.querySelector(".confirm.delete").style.display = "none";
    setTimeout(() => history.push(`/search-score`), 500);
  };

  return (
    <ProtectedPage>
      <Confirm
        confirmType="add"
        result={[]}
        handleConfirmAcceptBtn={handleConfirmAcceptBtn}
        handleConfirmCancelBtn={handleConfirmCancelBtn}
      />
      <Confirm
        confirmType="delete"
        result={[]}
        handleConfirmAcceptBtn={handleConfirmDeleteBtn}
        handleConfirmCancelBtn={handleCancelDeleteBtn}
      />
      <Notification status="failed" message={message} />

      {status == "input" ? (
        <div className="create-score">
          <h3>Chi tiết điểm</h3>
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
          <div className="score-info">
            <h5>Người nhập: {getNameOfUser(studentList[0]?.creator)}</h5>
            <h5>Người chỉnh sửa: {getNameOfUser(studentList[0]?.editor)}</h5>
            <h5>Thời gian nhập: {getDate(studentList[0]?.createdAt)}</h5>
            <h5>
              Thời gian chỉnh sửa: {getNameOfUser(studentList[0]?.updatedAt)}
            </h5>
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
                  <Input
                    type="small"
                    // value={finalResult[i]?.score15Min}
                    placeholder="Nhập điểm 15'..."
                  />
                </div>
                <div className="item col-20-percent center al-center per-1">
                  <Input
                    type="small"
                    // value={finalResult[i]?.score1Per}
                    placeholder="Nhập điểm 1 tiết..."
                  />
                </div>
                <div className="item col-20-percent center al-center">
                  {/* {finalResult[i]?.avgScore} */}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="create-score">
          <h3>Chi tiết điểm</h3>
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
          <div className="score-info">
            <h5>Người nhập: {getNameOfUser(studentList[0]?.creator)}</h5>
            <h5>Người chỉnh sửa: {getNameOfUser(studentList[0]?.editor)}</h5>
            <h5>Thời gian nhập: {getDate(studentList[0]?.createdAt)}</h5>
            <h5>Thời gian chỉnh sửa: {getDate(studentList[0]?.updatedAt)}</h5>
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
                <div
                  className="item col-20-percent center al-center min-15"
                  href="#"
                  id={"Min" + i}>
                  {finalResult[i]?.score15Min}
                </div>
                <UncontrolledTooltip placement="right" target={"Min" + i}>
                  Hệ số 1
                </UncontrolledTooltip>
                <div
                  className="item col-20-percent center al-center per-1"
                  href="#"
                  id={"Per" + i}>
                  {finalResult[i]?.score1Per}
                </div>
                <UncontrolledTooltip placement="right" target={"Per" + i}>
                  Hệ số 2
                </UncontrolledTooltip>
                <div className="item col-20-percent center al-center">
                  {finalResult[i]?.avgScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="btns" style={{ margin: "30px 0 0 0" }}>
        {status === "confirm" && (
          <>
            <Button
              innerText="Lưu"
              btnType="save"
              onClick={handleClickSaveBtn}
            />
          </>
        )}
        {status === "input" && (
          <>
            <Button
              innerText="Xóa"
              btnType="clear"
              onClick={handleClickDeleteBtn}></Button>
            <Button innerText="Lưu" btnType="add" onClick={handleClickAddBtn} />
          </>
        )}
        {status === "view" && (
          <>
            <Button
              innerText="Xuất kết quả"
              btnType="save"
              onClick={onClickExport}
            />

            {(user?.role === "bgh" ||
              (user?.role === "gv" && user?._id === creatorID)) && (
              <Button
                innerText="Chỉnh sửa"
                btnType="update"
                onClick={onClickUpdateBtn}
              />
            )}
          </>
        )}
      </div>
    </ProtectedPage>
  );
};

export default ScoreDetail;
