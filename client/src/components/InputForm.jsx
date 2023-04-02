import React from "react";
import { useController } from "react-hook-form";

const InputForm = ({ control, ...props }) => {
	const { field } = useController({
		control,
		name: props.name,
		defaultValue: "",
	});
	return (
		<input
			className="w-full input py-2 mb-1 px-3 border border-[#cbb9c4] outline-none focus:border-primary"
			{...field}
			{...props}
		/>
	);
};

export default InputForm;
