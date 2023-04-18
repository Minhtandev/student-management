import { useEffect, useRef, useState } from "react";

export default function useClickOutside(dom = "button") {
	const [show, setShow] = useState(false);
	const nodeRef = useRef(null);

	useEffect(() => {
		function handleClickOutside(e) {
			console.log(
				9,
				nodeRef.current,
				!nodeRef.current.contains(e.target),
				!e.target.matches(dom)
			);
			if (
				nodeRef.current &&
				!nodeRef.current.contains(e.target) &&
				!e.target.matches(dom)
			) {
				setShow(false);
			}
		}

		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [show]);

	return {
		nodeRef,
		show,
		setShow,
	};
}
