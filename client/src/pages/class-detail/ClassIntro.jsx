import React from "react";
import "./Intro.scss";
import studentImg from "../../assets/student.png";
import classImg from "../../assets/class.png";
import imgPage from "../../assets/imgPage.png";
import { Card } from "../../components/Card";
import ProtectedPage from "../../components/ProtectedPage";
export const ClassIntro = () => {
  return (
    <ProtectedPage>
      <div className="add-page add-screen">
        <img className="img-main" src={imgPage} alt="" />
        <div className="main-1"></div>
        <div className="main-2">
          <div className="desc">
            <h1>
              Lập danh sách lớp
              <br /> chỉnh sửa các danh sách lớp
            </h1>
            <p>
              Lập danh sách lớp
              <br />
              Tra cứu và cập nhật danh sách lớp
              <br />
            </p>
          </div>
          <div className="cards">
            <Card
              img={studentImg}
              link="add/add-class"
              content="Lập danh sách lớp"
              color="linear-gradient(80.24deg, #96ABE7 1.31%, #96A2EA 15.22%, #9788F2 37.23%, #985FFE 66.2%, #985CFF 68.51%)"></Card>
            <Card
              img={classImg}
              link="search-class-detail"
              content="Tra cứu lớp"
              color="linear-gradient(80.24deg, #96DDE7 1.31%, #96EAEA 15.22%, #88ECF2 37.23%, #5FE1FE 66.2%)"></Card>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};
