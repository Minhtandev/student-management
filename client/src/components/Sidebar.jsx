import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { Navigation } from "react-minimal-side-navigation";
import Logo from "../assets/Logo.png";
import Home from "../assets/Home.png";
import File from "../assets/File.png";
import Search from "../assets/Search.png";
import People from "../assets/People.png";
import Add from "../assets/Add.png";
// import Search from "../assets/loupe.png";

// import List from "../assets/List.png";
import StudentSidebar from "../assets/Student-sidebar.png";
import Report from "../assets/Report.png";
import Setting from "../assets/Setting.png";
// import { Routes } from "../config/Routes";
import { useHistory, useLocation } from "react-router-dom";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "./Sidebar.scss";
import "./Sidebar_Lib.scss";

const Sidebar = ({ nodeRef = "", handleShow = () => {} }) => {
  const history = useHistory();
  const [userRole, setUserRole] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    try {
      let role = window.localStorage.getItem("user-role");
      let name = JSON.parse(window.localStorage.getItem("user-qlhs"))?.name;
      setUserRole(role);
      setName(name);
    } catch (err) {
      console.log(err);
    }
  }, [window.localStorage.getItem("user-qlhs")]);

  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const location = useLocation();
  return (
    <React.Fragment>
      {userRole !== "" ? (
        <div className="sidebar">
          <div className="logo">
            <img src={Logo} alt="" />
            <h2>THPT ABC</h2>
          </div>
          <div
            // className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-sky-400 border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${
            //   isSidebarOpen
            //     ? "ease-out translate-x-0"
            //     : "ease-in -translate-x-full"
            // }`}
            ref={nodeRef}
            onClick={handleShow}>
            {userRole === "bgh" && (
              <Navigation
                // you can use your own router's api to get pathname

                activeItemId="/"
                onSelect={({ itemId }) => {
                  // maybe push to the route
                  if (itemId === "/login") window.location.reload(false);
                  history.push(itemId);
                }}
                items={[
                  {
                    title: "Trang chủ",
                    itemId: "/",
                    // you can use your own custom Icon component as well
                    // icon is optional
                    elemBefore: () => (
                      <img src={Home} alt="" />
                      //<i class="fa-solid fa-house"></i>
                    ),
                  },
                  {
                    title: "Quản lý học sinh",
                    itemId: "/student",
                    elemBefore: () => (
                      <img src={Add} alt="" /> //<i class="fa-solid fa-tv"></i>
                    ),
                    subNav: [
                      {
                        title: "Tiếp nhận học sinh",
                        itemId: "/add/add-student",
                        // Requires v1.9.1+ (https://github.com/abhijithvijayan/react-minimal-side-navigation/issues/13)
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                      {
                        title: "Tra cứu học sinh",
                        itemId: "/search-student",
                        // Requires v1.9.1+ (https://github.com/abhijithvijayan/react-minimal-side-navigation/issues/13)
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                    ],
                  },
                  {
                    title: "Quản lý lớp học",
                    itemId: "/class",
                    elemBefore: () => (
                      <img src={Search} alt="" /> //<i class="fa-solid fa-magnifying-glass"></i>
                    ),
                    subNav: [
                      {
                        title: "Lập danh sách lớp",
                        itemId: "/add/add-class",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },

                      {
                        title: "Tra cứu danh sách lớp",
                        itemId: "/search-class-detail",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                    ],
                  },
                  {
                    title: "Quản lý điểm môn",
                    itemId: "/score-intro",
                    elemBefore: () => (
                      <img src={People} alt="" /> //<i class="fa-solid fa-user-graduate"></i>
                    ),
                    subNav: [
                      {
                        title: "Nhập điểm",
                        itemId: "/score",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },

                      {
                        title: "Tra cứu điểm",
                        itemId: "/search-score",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                    ],
                  },
                  {
                    title: "Báo cáo",
                    itemId: "/report",
                    elemBefore: () => (
                      <img src={File} alt="" /> //<i class="fa-solid fa-file-lines"></i>
                    ),
                    subNav: [
                      {
                        title: "Báo cáo môn học",
                        itemId: "/report/report-subject",
                        // Requires v1.9.1+ (https://github.com/abhijithvijayan/react-minimal-side-navigation/issues/13)
                      },
                      {
                        title: "Báo cáo học kỳ",
                        itemId: "/report/report-term",
                      },
                    ],
                  },
                  {
                    title: "Thay đổi quy định",
                    itemId: "/setting",
                    elemBefore: () => (
                      <img src={Setting} alt="" />
                      //<i class="fa-solid fa-gears"></i>
                    ),
                    subNav: [
                      {
                        title: "Danh sách tham số",
                        itemId: "/setting/setting-list",
                        // Requires v1.9.1+ (https://github.com/abhijithvijayan/react-minimal-side-navigation/issues/13)
                      },
                      {
                        title: "Danh sách lớp",
                        itemId: "/setting/class-list",
                      },
                      {
                        title: "Danh sách môn học",
                        itemId: "/setting/subject-list",
                      },
                      {
                        title: "Danh sách tài khoản",
                        itemId: "/setting/user",
                      },
                    ],
                  },
                  {
                    title: "Đăng xuất",
                    itemId: "/login",
                    elemBefore: () => (
                      <img src={People} alt="" /> //<i class="fa-solid fa-user-graduate"></i>
                    ),
                  },
                ]}
              />
            )}
            {userRole === "gv" && (
              <Navigation
                // you can use your own router's api to get pathname

                activeItemId="/"
                onSelect={({ itemId }) => {
                  // maybe push to the route
                  history.push(itemId);
                }}
                items={[
                  {
                    title: "Trang chủ",
                    itemId: "/",
                    // you can use your own custom Icon component as well
                    // icon is optional
                    elemBefore: () => (
                      <img src={Home} alt="" />
                      //<i class="fa-solid fa-house"></i>
                    ),
                  },
                  {
                    title: "Tra cứu",
                    itemId: "/search-student",
                    elemBefore: () => (
                      <img src={Search} alt="" /> //<i class="fa-solid fa-magnifying-glass"></i>
                    ),
                    subNav: [
                      {
                        title: "Tra cứu học sinh",
                        itemId: "/search-student",
                        // Requires v1.9.1+ (https://github.com/abhijithvijayan/react-minimal-side-navigation/issues/13)
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                      {
                        title: "Tra cứu danh sách lớp",
                        itemId: "/search-class-detail",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                    ],
                  },
                  {
                    title: "Quản lý điểm môn",
                    itemId: "/score-intro",
                    elemBefore: () => (
                      <img src={People} alt="" /> //<i class="fa-solid fa-user-graduate"></i>
                    ),
                    subNav: [
                      {
                        title: "Nhập điểm",
                        itemId: "/score",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },

                      {
                        title: "Tra cứu điểm",
                        itemId: "/search-score",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                    ],
                  },
                  {
                    title: "Đăng xuất",
                    itemId: "/login",
                    elemBefore: () => (
                      <img src={People} alt="" /> //<i class="fa-solid fa-user-graduate"></i>
                    ),
                  },
                ]}
              />
            )}
            {userRole === "pgv" && (
              <Navigation
                // you can use your own router's api to get pathname

                activeItemId="/"
                onSelect={({ itemId }) => {
                  // maybe push to the route
                  history.push(itemId);
                }}
                items={[
                  {
                    title: "Trang chủ",
                    itemId: "/",
                    // you can use your own custom Icon component as well
                    // icon is optional
                    elemBefore: () => (
                      <img src={Home} alt="" />
                      //<i class="fa-solid fa-house"></i>
                    ),
                  },
                  {
                    title: "Quản lý học sinh",
                    itemId: "/student",
                    elemBefore: () => (
                      <img src={Add} alt="" /> //<i class="fa-solid fa-tv"></i>
                    ),
                    subNav: [
                      {
                        title: "Tiếp nhận học sinh",
                        itemId: "/add/add-student",
                        // Requires v1.9.1+ (https://github.com/abhijithvijayan/react-minimal-side-navigation/issues/13)
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                      {
                        title: "Tra cứu học sinh",
                        itemId: "/search-student",
                        // Requires v1.9.1+ (https://github.com/abhijithvijayan/react-minimal-side-navigation/issues/13)
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                    ],
                  },
                  {
                    title: "Quản lý lớp học",
                    itemId: "/class",
                    elemBefore: () => (
                      <img src={Search} alt="" /> //<i class="fa-solid fa-magnifying-glass"></i>
                    ),
                    subNav: [
                      {
                        title: "Lập danh sách lớp",
                        itemId: "/add/add-class",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },

                      {
                        title: "Tra cứu danh sách lớp",
                        itemId: "/search-class-detail",
                        // elemBefore: () => <img src={Home} alt="" />,
                      },
                    ],
                  },
                  {
                    title: "Đăng xuất",
                    itemId: "/login",
                    elemBefore: () => (
                      <img src={People} alt="" /> //<i class="fa-solid fa-user-graduate"></i>
                    ),
                  },
                ]}
              />
            )}
          </div>
          <div className="flex user">
            <svg
              width="24"
              height="24"
              viewBox="0 0 34 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 2.83334C15.1396 2.83334 13.2974 3.19978 11.5787 3.91172C9.85988 4.62366 8.29816 5.66717 6.98266 6.98266C4.3259 9.63943 2.83334 13.2428 2.83334 17C2.83334 20.7572 4.3259 24.3606 6.98266 27.0174C8.29816 28.3329 9.85988 29.3764 11.5787 30.0883C13.2974 30.8002 15.1396 31.1667 17 31.1667C20.7572 31.1667 24.3606 29.6741 27.0174 27.0174C29.6741 24.3606 31.1667 20.7572 31.1667 17C31.1667 15.1396 30.8002 13.2974 30.0883 11.5787C29.3764 9.85988 28.3329 8.29816 27.0174 6.98266C25.7019 5.66717 24.1401 4.62366 22.4214 3.91172C20.7026 3.19978 18.8604 2.83334 17 2.83334ZM10.0158 25.8967C10.625 24.6217 14.3367 23.375 17 23.375C19.6633 23.375 23.375 24.6217 23.9842 25.8967C22 27.4777 19.5371 28.337 17 28.3333C14.365 28.3333 11.9425 27.4267 10.0158 25.8967ZM26.01 23.8425C23.9842 21.3775 19.0683 20.5417 17 20.5417C14.9317 20.5417 10.0158 21.3775 7.99001 23.8425C6.48294 21.8799 5.6662 19.4745 5.66668 17C5.66668 10.7525 10.7525 5.66668 17 5.66668C23.2475 5.66668 28.3333 10.7525 28.3333 17C28.3333 19.5783 27.455 21.9583 26.01 23.8425ZM17 8.50001C14.2517 8.50001 12.0417 10.71 12.0417 13.4583C12.0417 16.2067 14.2517 18.4167 17 18.4167C19.7483 18.4167 21.9583 16.2067 21.9583 13.4583C21.9583 10.71 19.7483 8.50001 17 8.50001ZM17 15.5833C16.4364 15.5833 15.8959 15.3595 15.4974 14.9609C15.0989 14.5624 14.875 14.0219 14.875 13.4583C14.875 12.8948 15.0989 12.3543 15.4974 11.9557C15.8959 11.5572 16.4364 11.3333 17 11.3333C17.5636 11.3333 18.1041 11.5572 18.5026 11.9557C18.9011 12.3543 19.125 12.8948 19.125 13.4583C19.125 14.0219 18.9011 14.5624 18.5026 14.9609C18.1041 15.3595 17.5636 15.5833 17 15.5833Z"
                fill="black"
              />
            </svg>

            <p className="user-name">{name}</p>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default Sidebar;
