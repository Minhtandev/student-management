import React from "react";
// import "./Setting.scss";
import EditIcon from "../../assets/edit-icon.png";
import { useState, useEffect } from "react";
// import { settingArr } from "../../config/getAPI";
import { Confirm } from "../../components/Confirm";
import { Notification } from "../../components/Notification";
import { handler, helper } from "../../handle-event/HandleEvent";
import { api } from "../../api/api";
import ProtectedPage from "../../components/ProtectedPage";
const vietName = {
  "max-age": "Tuổi tối đa",
  "min-age": "Tuổi tối thiểu",
  "pass-score": "Điểm qua môn",
  "max-score": "Điểm tối đa",
  "min-score": "Điểm tối thiểu",
  "max-total": "Sĩ số tối đa",
};
// import axios from "axios";
export const SettingList = () => {
  const [settingArrState, setSettingArrState] = useState([]);
  const [result, setResult] = useState([]);
  const [resultUI, setResultUI] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      const apiArr = await api.getSettingList();
      setSettingArrState(
        apiArr.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
      );
    };
    getData();
  }, []);

  const handleEvent = {
    handleConfirmAcceptBtn: {
      editSetting: () => {
        // helper.turnOffConfirm("edit");
        document.querySelector(".confirm").style.display = "none";
        //kiểm tra ràng buộc dữ liệu
        let checkEmptyMessage = helper.validateData("empty", result[0]);
        if (checkEmptyMessage !== "ok") {
          setMessage(checkEmptyMessage);
          document.querySelector(
            ".notification--failed"
          ).parentElement.style.display = "flex";
        } else {
          //tạo copy
          const settingArrStateCopy = helper.generateArrCopy(settingArrState);

          //cập nhật mảng
          let index = settingArrStateCopy.findIndex(
            (item) => item.name == result[0].name
          );
          settingArrStateCopy[index] = result[0];
          settingArrStateCopy[index].Edit = false;
          setSettingArrState(
            settingArrStateCopy.sort((a, b) =>
              a.name > b.name ? 1 : b.name > a.name ? -1 : 0
            )
          );

          //hiển thị thông báo
          helper.turnOnNotification("edit");

          //cập nhật xuống CSDL
          api.putSetting(settingArrState[index]._id, {
            value: result[0].value,
          });
        }
      },
    },

    handleSaveToEditBtn: {
      setting: (e) => {
        let settingArrStateCopy = JSON.parse(JSON.stringify(settingArrState));
        let index = +e.target.getAttribute("data-set");
        let inputs = e.target.closest(".row").querySelectorAll("input");
        settingArrStateCopy[index].value = inputs[0].value;

        let newResult = settingArrStateCopy[index];
        setResult([newResult]);
        let newResultUI = {
          "Tên tham số": newResult.nameSet,
          "Giá trị": newResult.value,
        };
        setResultUI([newResultUI]);
        helper.turnOnConfirm("edit");
      },
    },
    // handleValueInputChange: (e, i) => {
    //   let settingArrStateCopy = JSON.parse(JSON.stringify(settingArrState));
    //   settingArrStateCopy[i].value = e.target.value;
    //   setSettingArrState(settingArrStateCopy);
    // },
  };

  return (
    <ProtectedPage>
      <Confirm
        confirmType="edit"
        result={resultUI}
        handleConfirmCancelBtn={() => helper.turnOffConfirm("edit")}
        handleConfirmAcceptBtn={handleEvent.handleConfirmAcceptBtn.editSetting}
      />
      <Notification status="failed" message={message} />

      <div className="setting">
        <h3>Danh sách tham số</h3>
        <div className="guide">Bạn chỉ có thể chỉnh giá trị của tham số</div>
        <div className="container">
          <div className="grid">
            <div className="row heading">
              <div className="item col-33-percent center">Tên quy định</div>
              <div className="item col-33-percent center">Giá trị</div>
              <div className="item col-33-percent center">Thao tác</div>
            </div>
            {settingArrState.map((item, i) => (
              <>
                <div className="row content" key={i}>
                  <div className="item col-33-percent center al-left pl-80">
                    {vietName[item.name]}
                  </div>
                  <div className="item col-33-percent center">{item.value}</div>
                  <div className="item col-33-percent center">
                    <button
                      className="edit-btn"
                      data-set={i}
                      onClick={(e) =>
                        handler.handleClickEditBtn(
                          e,
                          settingArrState,
                          setSettingArrState
                        )
                      }>
                      <img className="edit-img" src={EditIcon} alt="" />
                    </button>
                  </div>
                </div>
                {item.Edit ? (
                  <div className="row content" key={i}>
                    <div className="item col-33-percent center "></div>
                    <div className="item col-33-percent center">
                      <input
                        type="text"
                        className="input--small"
                        placeholder="Nhập giá trị mới..."
                        value={item.value}
                        onChange={(e) =>
                          handler.handleEditInputChange(
                            e,
                            i,
                            settingArrState,
                            setSettingArrState,
                            "value"
                          )
                        }
                      />
                    </div>
                    <div className="item col-33-percent center save-btn__container">
                      <button
                        className="save-btn--small"
                        onClick={(e) =>
                          handleEvent.handleSaveToEditBtn.setting(e)
                        }
                        data-set={i}>
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
};
