import "./AddStudent.scss";
import { Input } from "../../components/Input";
import { Confirm } from "../../components/Confirm";
import { useState, useEffect, useRef } from "react";
import { Button } from "../../components/Button";
import { Notification } from "../../components/Notification";

import { api } from "../../api/api";
import { helper } from "../../handle-event/HandleEvent";
import axios from "axios";
import ProtectedPage from "../../components/ProtectedPage";

import { OutTable, ExcelRenderer } from "react-excel-renderer";
import {
  Jumbotron,
  Col,
  Input as ReactInput,
  InputGroup,
  InputGroupAddon,
  FormGroup,
  Label,
  Button as ReactButton,
  Fade,
  FormFeedback,
  Container,
  Card,
} from "reactstrap";
export const AddStudent = () => {
  const fileInput = useRef(null);

  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [studentArrState, setStudentArrState] = useState([]);
  const [message, setMessage] = useState("");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(0);
  const [newID, setNewID] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [imageLink, setImageLink] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const getStudentArr = async () => {
      const dataArr = await api.getStudentInfoArr();
      const settingList = await api.getSettingList();
      const user = JSON.parse(window.localStorage.getItem("user-qlhs"));
      let min = settingList.find((item) => item.name === "min-age")?.value;
      let max = settingList.find((item) => item.name === "max-age")?.value;
      let newStudentID = helper.generateID(dataArr, "ID", "HS");

      setMinAge(Number(min));
      setMaxAge(Number(max));
      setNewID(newStudentID);
      setUser(user._id);
      setStudentArrState(dataArr);
    };
    getStudentArr();
  }, []);

  const renderFile = (fileObj) => {
    console.log("renderFile>>>>>");
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, res) => {
      if (err) {
        console.log("renderFileErr>>>>", err);
      } else {
        console.log("renderFileSuccess>>>>", res);
        setDataLoaded(true);
        // setCols(res.cols.unshift({ name: "none", key: "9999" }));
        let lastCol = res.cols[res.cols.length - 1];
        setCols([
          ...res.cols,
          {
            name: String.fromCharCode(lastCol.name.charCodeAt(0) + 1),
            key: lastCol.key + 1,
          },
        ]);
        setRows(res.rows);
      }
    });
  };

  const fileHandler = (event) => {
    if (event.target.files.length) {
      console.log("fileHandler>>>>>");
      let fileObj = event.target.files[0];
      console.log("fileObj>>>>>", fileObj);
      let fileName = fileObj.name;

      //check for file extension and pass only if it is .xlsx and display error message otherwise
      if (fileName.slice(fileName.lastIndexOf(".") + 1) === "xlsx") {
        // this.setState({
        //   uploadedFileName: fileName,
        //   isFormInvalid: false
        // });
        // this.renderFile(fileObj)
        setFileName(fileName);
        setIsFormInvalid(false);
        renderFile(fileObj);
      } else {
        // this.setState({
        //   isFormInvalid: true,
        //   uploadedFileName: ""
        // })
        setIsFormInvalid(true);
        setFileName("");
      }
    }
  };

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const openFileBrowser = () => {
    console.log("openFileBrowser>>>>>");
    fileInput.current.click();
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "xfubk0t8");

    await axios
      .post("https://api.cloudinary.com/v1_1/djt9g7wvi/image/upload", formData)
      .then((res) => {
        console.log(res);
        console.log("url ảnh>>>>", res.data.secure_url);
        setImageLink(res.data.secure_url);
      });
  };

  //Xử lý nút lưu của màn hình xác nhận
  const handleConfirmAcceptBtn = async () => {
    // helper.turnOffConfirm("edit");
    document.querySelector(".confirm.add").style.display = "none";

    console.log("result", result[0]);
    //kiểm tra ràng buộc
    let checkEmptyMessage = helper.validateData("empty", result[0]);
    let checkAgeMessage = helper.validateData(
      "age",
      {
        birth: result[0].birth,
      },
      null,
      minAge,
      maxAge
    );
    let checkEmailMessage = helper.validateData("email", {
      email: result[0].email,
    });
    const checkMessageArr = [
      checkEmptyMessage,
      checkAgeMessage,
      checkEmailMessage,
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
      //Lưu xuống CSDL
      // const studentArrStateCopy = JSON.parse(JSON.stringify(studentArrState));
      // studentArrStateCopy.push(result[0]);
      // setStudentArrState(studentArrStateCopy);

      //Lưu xuống CSDL
      await api.postStudentInfo(result[0]);

      //hiện thông báo
      document.querySelector(".notification").style.display = "flex";
    }
  };

  //Xử lý nút hủy của màn hình xác nhận
  const handleConfirmCancelBtn = () => {
    document.querySelector(".confirm.add").style.display = "none";
  };

  //Xử lý nút lưu của màn hình xác nhận import
  const handleConfirmAcceptAllBtn = async () => {
    // helper.turnOffConfirm("edit");
    document.querySelector(".confirm.add-all").style.display = "none";

    console.log("chuẩn bị import!!!");
    const [heading, ...rowsContent] = rows;
    const payload = rowsContent.map((item, i) => {
      const [name, birth, gender, email, image, address] = item;

      return {
        name: name,
        birth: birth,
        email: email,
        address: address,
        gender: gender === "Nam" ? "male" : "female",
        image: image,
        ID: helper.generateIDWithIncrement(studentArrState, "ID", "HS", i),
        creator: user,
        editor: user,
      };
    });
    console.log("payload>>>>", payload);
    for (const newStudent of payload) {
      //kiểm tra ràng buộc
      // let checkEmptyMessage = helper.validateData("empty", newStudent);
      let checkAgeMessage = helper.validateData(
        "age",
        {
          birth: newStudent.birth,
        },
        null,
        minAge,
        maxAge
      );
      let checkEmailMessage = helper.validateData("email", {
        email: newStudent.email,
      });
      const checkMessageArr = [
        // checkEmptyMessage,
        checkAgeMessage,
        checkEmailMessage,
      ];
      let isValid = checkMessageArr.filter((item) => item !== "ok").length == 0;
      console.log("Valid>>>", isValid, checkAgeMessage, checkEmailMessage);

      if (isValid) {
        //Lưu xuống CSDL
        await api.postStudentInfo(newStudent);

        console.log("import thành công");
        //hiện thông báo
        document.querySelector(".notification").style.display = "flex";
      }
    }
  };

  //Xử lý nút hủy của màn hình xác nhận import
  const handleConfirmCancelAllBtn = () => {
    document.querySelector(".confirm.add-all").style.display = "none";
  };

  //Xử lý nút làm mới
  const handleRefresh = () => {
    document.querySelectorAll("input, textarea").forEach((item) => {
      item.value = "";
    });
  };

  //Xử lý nút thêm mới
  const handleSubmit = (e) => {
    e.preventDefault();
    //Gom dữ liệu về 1 object
    const inputs = Array.from(
      document.querySelectorAll(".grid__item:not(.select) input, textarea")
    );
    console.log("inputs>>>", inputs);

    const selects = Array.from(document.querySelectorAll(".dropdown_selected"));

    const newStudent = {
      // ID: helper.generateID(studentArrState, "ID", "SD"),
      name: inputs[1].value,
      birth: inputs[2].value,
      email: inputs[3].value,
      address: inputs[5].value,
      gender:
        selects[0]
          .querySelector(".dropdown_selected-default")
          .innerText.trim() === "Nam"
          ? "male"
          : "female",
      image: imageLink,
      ID: newID,
      creator: user,
      editor: user,
    };

    const newStudentUI = {
      "Mã HS": newID,
      "Họ tên": inputs[1].value,
      "Ngày sinh": inputs[2].value,
      Email: inputs[3].value,
      "Giới tính": selects[0].querySelector(".dropdown_selected-default")
        .innerText,
      "Địa chỉ": inputs[5].value,
      Ảnh: imageLink,
    };

    //Đưa lên confirm
    setResult([newStudent]);
    setResultUI([newStudentUI]);
    document.querySelector(".confirm.add").style.display = "flex";
  };

  //Xử lý nút import
  const handleAddAll = () => {
    setResult([]);
    setResultUI([]);
    document.querySelector(".confirm.add-all").style.display = "flex";
  };
  return (
    <ProtectedPage>
      <div className="add-student add-student-screen">
        <Confirm
          confirmType="add"
          result={resultUI}
          handleConfirmCancelBtn={handleConfirmCancelBtn}
          handleConfirmAcceptBtn={handleConfirmAcceptBtn}
        />
        <Confirm
          confirmType="add-all"
          result={resultUI}
          handleConfirmCancelBtn={handleConfirmCancelAllBtn}
          handleConfirmAcceptBtn={handleConfirmAcceptAllBtn}
        />
        <Notification status="failed" message={message} />
        <h3>Thêm học sinh</h3>
        <div className="guide">
          Điền vào thông tin học sinh theo mẫu bên dưới. Lưu ý điền đầy đủ tất
          cả các trường
        </div>
        <hr></hr>
        <h4>Thêm nhiều học sinh</h4>

        <Container>
          <form>
            <FormGroup row>
              <Col xs={4} sm={8} lg={10}>
                <InputGroup>
                  {/* <InputGroupAddon addonType="prepend"> */}
                  <ReactButton
                    color="info"
                    style={{ color: "white", zIndex: 0 }}
                    onClick={() => openFileBrowser()}>
                    <i className="cui-file"></i> Tải lên&hellip;
                  </ReactButton>
                  <input
                    type="file"
                    hidden
                    onChange={(e) => fileHandler(e)}
                    ref={fileInput}
                    // onClick={(event) => {
                    //   event.target.value = null;
                    // }}
                    style={{ padding: "10px" }}
                  />
                  {/* </InputGroupAddon> */}
                  <ReactInput
                    type="text"
                    className="form-control"
                    value={fileName}
                    readOnly
                    invalid={isFormInvalid}
                  />
                  <FormFeedback>
                    <Fade
                      in={isFormInvalid}
                      tag="h6"
                      style={{ fontStyle: "italic" }}>
                      Chỉ được chọn file có đuôi .xlsx !!!
                    </Fade>
                  </FormFeedback>
                </InputGroup>
              </Col>
            </FormGroup>
          </form>

          {dataLoaded && (
            <Card body outline color="secondary" className="restrict-card">
              <OutTable
                data={rows ? rows : []}
                columns={cols ? cols : []}
                tableClassName="ExcelTable2007"
                tableHeaderRowClass="heading"
              />
            </Card>
          )}
          <div className="btns al-center">
            <Button
              btnType="add"
              onClick={() => handleAddAll()}
              innerText="Thêm mới"></Button>
          </div>
        </Container>
        <hr></hr>
        <h4>Thêm từng học sinh</h4>
        <form className="grid">
          <div className="row">
            <Input value={newID} type="disabled" labelText="Mã HS" />
          </div>
          <div className="row">
            <Input
              type="text"
              placeholder="Nhập họ tên học sinh..."
              labelText="Họ và tên"
            />
            <Input type="date" labelText="Ngày sinh" />
          </div>
          <div className="row">
            <Input
              type="select"
              labelText="Giới tính"
              name="gender"
              selectName="gender"
              options={[
                { value: "male", text: "Nam" },
                { value: "female", text: "Nữ" },
              ]}
            />
            <Input type="email" placeholder="Nhập email..." labelText="Email" />
          </div>
          <div className="row">
            <div
              className="image__container"
              style={{
                padding: 0,
                margin: 0,
                width: "unset",
                position: "relative",
                left: "10px",
              }}>
              <Input
                type="image"
                labelText="Ảnh"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  uploadImage(e.target.files[0]);
                }}
              />
              {image && (
                <div>
                  <img
                    alt="not found"
                    width={"250px"}
                    src={URL.createObjectURL(image)}
                  />
                  <button onClick={() => setImage(null)}></button>
                  <br />
                </div>
              )}
            </div>
            <Input
              type="textArea"
              labelText="Địa chỉ"
              rows="5"
              placeholder="Nhập địa chỉ..."
            />
          </div>
          <div className="btns al-center">
            <Button
              btnType="clear"
              onClick={handleRefresh}
              innerText="Làm sạch"></Button>
            <Button
              btnType="add"
              onClick={(e) => handleSubmit(e)}
              innerText="Thêm mới"></Button>
          </div>
        </form>
      </div>
    </ProtectedPage>
  );
};
