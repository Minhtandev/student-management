import { createContext, useContext, useEffect, useState } from "react";

const ViewportContext = createContext(undefined);
export default function ViewportProvider(props) {
	const [width, setWidth] = useState(window.innerWidth);
	const handleWindowResize = () => {
		setWidth(window.innerWidth);
	};
	useEffect(() => {
		window.addEventListener("resize", handleWindowResize);
		return () => window.removeEventListener("resize", handleWindowResize);
	}, []);
	return (
		<ViewportContext.Provider
			value={{ width }}
			{...props}
		></ViewportContext.Provider>
	);
}

export function useViewport() {
	const context = useContext(ViewportContext);
	if (typeof context === "undefined")
		throw new Error("useViewport must be used within a ViewportProvider");
	return context;
}
