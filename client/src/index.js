import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App";
import ViewportProvider from "./context/viewportContext";

// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

ReactDOM.render(
	<React.StrictMode>
		<ViewportProvider>
			<App />
		</ViewportProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
