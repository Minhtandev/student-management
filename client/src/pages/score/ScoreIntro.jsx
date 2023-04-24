import React from "react";
import "./Intro.scss";
import studentImg from "../../assets/student.png";
import classImg from "../../assets/class.png";
import imgPage from "../../assets/imgPage.png";
import { Card } from "../../components/Card";
import ProtectedPage from "../../components/ProtectedPage";
export const ScoreIntro = () => {
  return (
    <ProtectedPage>
      <div className="add-page add-screen">
        <img className="img-main" src={imgPage} alt="" />
        <div className="main-1"></div>
        <div className="main-2">
          <div className="desc">
            <h1>
              Nhập điểm,
              <br /> chỉnh sửa điểm
            </h1>
            <p>
              Nhập điểm cho học sinh <br />
              Tra cứu và cập nhật điểm của học sinh
              <br />
            </p>
          </div>
          <div className="cards">
            <Card
              img={studentImg}
              link="score"
              content="Nhập điểm"
              color="linear-gradient(80.24deg, #96ABE7 1.31%, #96A2EA 15.22%, #9788F2 37.23%, #985FFE 66.2%, #985CFF 68.51%)"></Card>
            <Card
              img={classImg}
              link="search-score"
              content="Tra cứu điểm"
              color="linear-gradient(80.24deg, #96DDE7 1.31%, #96EAEA 15.22%, #88ECF2 37.23%, #5FE1FE 66.2%)"></Card>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};
