import React from "react";
import "../student/Search.scss";
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
//studentArrTemp là để hiển thị, studentScoreArr là để lưu xuống CSDL
import * as XLSX from "xlsx";
import { useHistory } from "react-router-dom";

export const SearchScore = () => {
  const histoty = useHistory();
  const [scoreArr, setScoreArr] = useState([]);
  const [scoreUIArr, setScoreUIArr] = useState([]);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");
  // const [role, setRole] = useState("");
  useEffect(() => {
    const getData = async () => {
      //1. Lấy tất cả điểm, tất cả môn học, tất cả danh sách lớp, tất cả học kì
      const score = await api.getSubjectScore();
      const classArr = await api.getClassDetail();
      const subjectArr = await api.getSubjectList();
      const termArr = await api.getTermList();

      //2. Duyệt tất cả score, thêm vào thuộc tính tên môn, tên lớp, năm học
      const rawScore = score.map((score) => {
        let subjectName = subjectArr.find(
          (item) => item._id === score.subject
        )?.name;
        let className = classArr.find((item) => item._id === score.class)?.name;
        let schoolYear = classArr.find(
          (item) => item._id === score.class
        )?.schoolYear;
        let termName = termArr.find((item) => item._id === score.term)?.name;
        return {
          subjectId: score.subject,
          classId: score.class,
          termId: score.term,
          subjectName: subjectName,
          className: className,
          schoolYear: schoolYear,
          termName: termName,
        };
      });

      //3. Lập set bao gồm các object rồi trả về array
      const scoreArr = rawScore.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.subjectName === value.subjectName &&
              t.className === value.className &&
              t.termName === value.termName &&
              t.schoolYear === value.schoolYear
          )
      );

      console.log("rawScore>>>>", rawScore);
      console.log("ScoreArr>>>>", scoreArr);
      // const userFromLocal = JSON.parse(
      //   window.localStorage.getItem("user-qlhs")
      // );

      setScoreArr(scoreArr);
      setScoreUIArr(scoreArr);
      // setRole(userFromLocal ? userFromLocal.role : "");
    };
    getData();
  }, []);

  const handleChangeInput = (e) => {
    const inputValue = e.target.value;
    const scoreArrStateCopy = scoreArr.filter((item) => {
      for (const [key, value] of Object.entries(item)) {
        if (String(value).toLowerCase().includes(inputValue.toLowerCase()))
          return true;
      }
      return false;
    });
    setScoreUIArr(scoreArrStateCopy);
  };

  return (
    <ProtectedPage>
      <div className="search-page">
        <h3>TRA CỨU ĐIỂM</h3>
        <div className="guide">Nhập tên lớp hoặc năm học mà bạn muốn tìm.</div>
        <div className="grid">
          <div className="row">
            <div className="grid__item">
              <input
                onChange={(e) => handleChangeInput(e)}
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
            <div className="item col-20-percent center al-center">Môn học</div>
            <div className="item col-20-percent center al-center">Lớp</div>
            <div className="item col-20-percent center al-center">Năm học</div>
            <div className="item col-20-percent center al-center">Học kì</div>
            <div className="item col-20-percent center al-center">Thao tác</div>
          </div>

          {scoreUIArr.length === 0 && (
            <span style={{ paddingLeft: "15px" }}>Không tìm thấy điểm</span>
          )}
          {scoreUIArr.map((item, i) => {
            return (
              <>
                <div className="row content">
                  <div className="item col-20-percent al-center">
                    {item.subjectName}
                  </div>
                  <div className="item col-20-percent al-center">
                    {item.className}
                  </div>
                  <div className="item col-20-percent al-center">
                    {item.schoolYear}
                  </div>
                  <div className="item col-20-percent al-center">
                    {item.termName}
                  </div>
                  <div
                    className="item col-20-percent center al-center"
                    style={{ display: "flex" }}>
                    <Button
                      btnType="detail"
                      innerText="Xem chi tiết"
                      data-set={i}
                      onClick={() =>
                        histoty.push(
                          `/score-detail/${item.className}/${item.subjectName}/${item.termName}/${item.schoolYear}`
                        )
                      }></Button>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </ProtectedPage>
  );
};
