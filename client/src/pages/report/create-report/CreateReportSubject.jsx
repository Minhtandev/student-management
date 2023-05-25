import React from "react";
import "./CreateReportSubject.scss";

// import { reportSubjectArr } from "../../../config/getAPI";
import { useState, useEffect } from "react";

import { Button } from "../../../components/Button";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { helper } from "../../../handle-event/HandleEvent";
// import { scoreSubject } from "../../../config/getAPI";
import * as XLSX from "xlsx";
import ProtectedPage from "../../../components/ProtectedPage";
export const CreateReportSubject = () => {
  const { subject, term, schoolYear } = useParams();

  const [data, setData] = useState([]);
  const [UIdata, setUIData] = useState([]);
  const onClickExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(UIdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    let today = new Date();
    let time = today.toTimeString().split(":").join("").substr(0, 4);
    let timestamp = helper.getTimestamp("yyyymmdd", today) + "" + time;

    XLSX.writeFile(
      workbook,
      `Báo cáo môn ${subject.toLowerCase()} ${term.toLowerCase()} năm học ${schoolYear} ${timestamp}.xlsx`
    );
  };

  useEffect(() => {
    const getData = async () => {
      //Lấy điểm trung bình
      let allSetting = await api.getSettingList();
      let passScore = allSetting.find(
        (setting) => setting.name === "pass-score"
      ).value;

      //Lấy tất cả danh sách lớp và lọc theo năm học
      const allClassDetails = await api.getClassDetail();
      const classDetails = allClassDetails.filter(
        (item) => item.schoolYear === schoolYear
      );

      //Lấy tất cả điểm môn học
      const allTerm = await api.getTermList();
      let termID = allTerm.find((item) => item.name === term)._id;
      const allSubject = await api.getSubjectList();
      let subjectID = allSubject.find((item) => item.name === subject)._id;
      const allSubjectScore = await api.getSubjectScore();

      //Tạo mảng DATA rỗng
      const DATA = [];

      //Duyệt các danh sách lớp
      classDetails.forEach((item) => {
        //Ở mỗi danh sách lớp:
        ////1. Lấy sĩ số
        ////2. Duyệt qua mỗi học sinh và lấy điểm học kì. Nếu lớn hơn trung bình thì ++
        ////3. Push vào mảng DATA
        let total = item.students.length;
        let passed = 0;
        item.students.forEach((studentID) => {
          let isThereScore = allSubjectScore.find(
            (score) =>
              score.student === studentID &&
              score.term === termID &&
              score.class === item._id &&
              score.subject === subjectID
          );
          let subjectScore = isThereScore ? isThereScore.avg : 0;
          if (subjectScore >= passScore) passed += 1;
          console.log("find>>>", studentID, termID, item._id);
          console.log("isThereScore>>>", isThereScore);
          console.log("subjectScore", subjectScore);
        });

        DATA.push({
          class: item.name,
          total: total,
          term: term,
          schoolYear: schoolYear,
          passed: passed,
          rate: total == 0 ? "0%" : `${((passed * 100) / total).toFixed(2)}%`,
        });
      });
      setData(DATA);
      setUIData(
        DATA.map((item) => {
          return {
            Lớp: item.class,
            "Sỉ số": item.total,
            "Số lượng đạt": item.passed,
            "Tỉ lệ": item.rate,
          };
        })
      );
    };
    getData();
  }, []);

  return (
    <ProtectedPage>
      <div className="create-report-subject">
        <h3>Báo cáo tổng kết môn học</h3>
        <div className="score-info">
          <h4>{term}</h4>
          <h4>Năm học: {schoolYear}</h4>
          <h4>Môn học: {subject}</h4>
        </div>
        <div className="container">
          <div className="row heading">
            <div className="item col-25-percent center al-center">Lớp</div>
            <div className="item col-25-percent center al-center">Sĩ số</div>
            <div className="item col-25-percent center al-center">
              Số lượng đạt
            </div>
            <div className="item col-25-percent center al-center">Tỉ lệ</div>
          </div>
          {data.map((item) => (
            <div className="row content">
              <div className="item col-25-percent center al-center">
                {item.class}
              </div>
              <div className="item col-25-percent center al-center">
                {item.total}
              </div>
              <div className="item col-25-percent center al-center">
                {item.passed}
              </div>
              <div className="item col-25-percent center al-center">
                {item.rate}
              </div>
            </div>
          ))}
        </div>
        <div
          className="btns"
          style={{
            transform: "translateX(20px)",
          }}>
          <Button
            innerText="In báo cáo"
            btnType="export"
            onClick={onClickExport}
          />
        </div>
      </div>
    </ProtectedPage>
  );
};
