import "./App.scss";
import { Routes } from "./config/Routes";
import { BrowserRouter, Route, useHistory } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { useViewport } from "./context/viewportContext";
import ButtonToggle from "./components/ButtonToggle";
import useClickOutside from "./hook/useClickOutside";
import { useEffect, useState } from "react";

function App() {
	const { nodeRef, show, setShow } = useClickOutside();
	const { width } = useViewport();
	const breakpoint = 860;

	// ẩn hiện menu
	const [userRole, setUserRole] = useState("");

	useEffect(() => {
		try {
			let role = window.localStorage.getItem("user-role");
			setUserRole(role);
			console.log(!!window.localStorage.getItem("user-role"));
		} catch (err) {
			console.log(err);
		}
	}, [window.localStorage.getItem("user-role")]);

	return (
		<div className="app">
			{width > breakpoint ? (
				<BrowserRouter basename={process.env.PUBLIC_URL}>
					<Route
						render={(props) => (
							<>
								<Sidebar nodeRef={nodeRef}></Sidebar>
								<div className="emp-sidebar"></div>
								<div className="container">
									{/* <Searchbar></Searchbar> */}
									<Routes></Routes>
								</div>
							</>
						)}
					></Route>
				</BrowserRouter>
			) : (
				<BrowserRouter basename={process.env.PUBLIC_URL}>
					<Route
						render={(props) => (
							<>
								{show ? (
									<Sidebar
										nodeRef={nodeRef}
										handleShow={() => {
											setShow((prev) => !prev);
										}}
									></Sidebar>
								) : userRole ? (
									<div className="w-full header flex">
										<h2>Trường THPT ABC</h2>
										<ButtonToggle onClick={() => setShow(true)}></ButtonToggle>
									</div>
								) : null}
								{/* <div className="emp-sidebar"></div> */}
								<Routes></Routes>
							</>
						)}
					></Route>
				</BrowserRouter>
			)}
		</div>
	);
}

export default App;
