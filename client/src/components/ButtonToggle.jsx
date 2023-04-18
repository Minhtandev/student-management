import React from "react";

const ButtonToggle = ({ onClick }) => {
	return (
		<button className="button-toggle" onClick={onClick}>
			Menu
		</button>
	);
};

export default ButtonToggle;
