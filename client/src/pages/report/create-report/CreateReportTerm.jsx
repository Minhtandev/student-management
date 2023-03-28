import React from "react";
import "./CreateReportTerm.scss";

// import { reportTermArr } from "../../../config/getAPI";
import { useState, useEffect } from "react";

import { Button } from "../../../components/Button";
import { useParams } from "react-router-dom";
import { api } from "../../../api/api";
import { ScoreSchoolYear } from "../../../config/getAPI";
import * as XLSX from "xlsx";
const DATA = [
  {
    class: "10A1",
    total: 40,
    term: "Học kì 1",
    schoolYear: "2017-2018",
    passed: 20,
    rate: "50%",
  },
  {
    class: "10A2",
    total: 40,
    term: "Học kì 1",
    schoolYear: "2017-2018",
    passed: 10,
    rate: "25%",
  },
];

export const CreateReportTerm = () => {
  const { term, schoolYear } = useParams();
  // const [termState, setTermState] = useState([]);
  // const [schoolYearState, setSchoolYearState] = useState([]);
  // const [scoreSchoolYearState, setScoreSchoolYearState] = useState([]);
  // const [classArr, setClassArrState] = useState([]);
  // const [reportTermState, setReportTermState] = useState([]);
  // let termID, schoolYearID;
  const [data, setData] = useState([]);
  const [UIdata, setUIData] = useState([]);
  const onClickExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(UIdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(workbook, "DataSheet.xlsx");
  };
  useEffect(() => {
    const getData = async () => {
      // const termArr = await api.getTermList();
      // const schoolYearArr = await api.getSchoolYearList();
      // const scoreArr = await api.getTermScores();
      // // const scoreArr = ScoreSchoolYear;
      // const classArray = await api.getClassDetail();
      // const reportTerm = await api.getTermReports();

      // termID = termArr.find((item) => item.nameTerm === term)._id;
      // schoolYearID = schoolYearArr.find(
      //   (item) => item.nameSchYear === schoolYear
      // )._id;

      // reportTerm.forEach((item) => {
      //   console.log("delete");
      //   api.deleteReportTerm(item._id);
      // });
      //   console.log(termArr, schoolYearArr, scoreArr, classArray, reportTerm);
      //   console.log(termID, schoolYearID);

      //   if (scoreArr.find((item) => !Boolean(item.schoolYearAvgScore))) {
      //     //tính điểm trung bình năm nếu có cái chưa tính
      //     scoreArr.forEach((item) => {
      //       let avg1 = item.scoreTerms[0] ? item.scoreTerms[0].termAvgScore : 0;
      //       let avg2 = item.scoreTerms[1] ? item.scoreTerms[1].termAvgScore : 0;
      //       item.schoolYearAvgScore = Number((avg1 + avg2) / 2).toFixed(2);
      //       api.putScoreSchoolYear(item._id, item);
      //     });
      //     setScoreSchoolYearState(scoreArr);
      //   }

      //Ma trận cấp ba giữa học kì, môn, ds lớp -> mỗi ô sẽ tạo thành 1 report
      // termArr.forEach((thisTerm) => {
      // classArray.forEach((thisClass) => {
      //   let thisSchoolYear = schoolYearArr.find(
      //     (item) => item._id === thisClass.schoolYear
      //   );

      //   let isThereScore = scoreArr.find(
      //     (score) => score.ClassDetail === thisClass._id
      //     // && score.term === thisTerm._id
      //   );

      //   let isThereReport = reportTerm.find(
      //     (report) => report.ClassDetail === thisClass._id
      //     // && report.term === thisTerm._id
      //   );

      //   console.log("isthereScore", isThereScore);
      //   console.log("thisSchoolYear", thisSchoolYear);
      //   //Nếu có điểm nhưng chưa có trong báo cáo thì thêm vào báo cáo
      //   if (isThereScore && !isThereReport) {
      //     //   if (true) {
      //     let total = thisClass.students.length;
      //     let passed = 0,
      //       rate;
      //     scoreArr.forEach((score) => {
      //       if (
      //         score.ClassDetail === thisClass._id &&
      //         // score.term === thisTerm._id &&
      //         score.schoolYearAvgScore >= 5
      //       ) {
      //         passed++;
      //       }
      //     });
      //     let rateNumber = ((passed * 100) / total).toFixed(2);
      //     rate = rateNumber + "%";

      //     api.postReportTerm({
      //       ClassDetail: thisClass._id,
      //       term: "6299d1a3197adb1f05703d97",
      //       schoolYear: thisSchoolYear._id,
      //       totalStudents: total,
      //       passed: passed,
      //       rate: rate ? rate : "100%",
      //     });
      //   }
      // });
      // });

      // const newReportTerm = await api.getTermReports();
      // console.log("newReport", newReportTerm);
      // const UIarr = newReportTerm.filter(
      //   (item) =>
      //     // item.term === termID &&
      //     item.schoolYear === schoolYearID
      // );

      // setScoreSchoolYearState(scoreArr);
      // setClassArrState(classArray);
      // setSchoolYearState(schoolYearArr);
      // setTermState(termArr);
      // setReportTermState(UIarr);
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
    <div className="create-report-term">
      <h3>Báo cáo tổng kết học kì</h3>
      <div className="score-info">
        <h4>{term}</h4>
        <h4>Năm học: {schoolYear}</h4>
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
        {/* {reportTermState.map((item) => (
          <div className="row content">
            <div className="item col-25-percent center al-center">
              {classArr.find((classItem) => classItem._id === item.ClassDetail)
                ? classArr.find(
                    (classItem) => classItem._id === item.ClassDetail
                  ).name
                : "10A5"}
            </div>
            <div className="item col-25-percent center al-center">
              {item.totalStudents}
            </div>
            <div className="item col-25-percent center al-center">
              {item.passed}
            </div>
            <div className="item col-25-percent center al-center">
              {item.rate}
            </div>
          </div>
        ))} */}
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
      <div className="btns">
        <Button
          innerText="Xuất kết quả"
          btnType="export"
          onClick={onClickExport}
        />
        <Button innerText="In kết quả" btnType="export" />
      </div>
    </div>
  );
};
