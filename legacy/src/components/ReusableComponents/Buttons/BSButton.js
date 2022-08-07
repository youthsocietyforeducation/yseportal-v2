/**
 * DO NOT MODIFY
 * Updated: June 21 2020
 *
 * Author: Kaung Yang
 * Created: June 21 2020
 *
 */

import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { EditOutlined, PlusOutlined, SendOutlined,DeleteOutlined } from "@ant-design/icons";
export const BSAddButton = (props) => {
	return (
		<Button {...props} size={"sm"} variant="success">
			<FontAwesomeIcon className="mr-2" icon={faPlus} />
			Add
		</Button>
	);
};
export const BSCancelButton = (props) => {
	return (
		<Button {...props} size={"sm"} type="reset" variant="default">
			Cancel
		</Button>
	);
};
export const BSSubmitButton = (props) => {
	return (
		<Button {...props} size={"sm"} type="submit" variant="primary">
			<SendOutlined className="mr-2" />
			Submit
		</Button>
	);
};
export const BSEditButton = (props) => {
	return (
		<Button {...props} size={"sm"} variant="warning">
			<EditOutlined className="mr-2" />
			Edit
		</Button>
	);
};
export const BSNewButton = (props) => {
	return (
		<Button size={"sm"} variant="success" {...props}>
			<PlusOutlined className="mr-2" />
			New
		</Button>
	);
};

export const BSViewButton = (props) => {
	return (
		<Button {...props} size={"sm"} variant="default">
			View
		</Button>
	);
};


export const BSDeleteButton = (props) => {
	return (
		<Button size={"sm"} variant="danger" {...props}>
			<DeleteOutlined className="mr-2" />
			Delete
		</Button>
	);
};

