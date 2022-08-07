import React from "react";

export const PageTitle = ({ title }) => {
	return (
		<h3 className="text-uppercase font-weight-bold">{title || "Title Page"}</h3>
	);
};
