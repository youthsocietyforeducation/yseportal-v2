/**
 * DO NOT MODIFY
 * Updated: June 21 2020
 *
 * Author: Kaung Yang
 * Created: June 21 2020
 *
 */

import React from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
export const AntDProfileUploadBtn = (props) => {
	const { onChange } = props;

	const customRequest = ({ file, onSuccess }) => {
		console.log("Upload customRequest file", file);
		onChange({ file });
	};

	return (
		<ImgCrop rotate>
			<Upload
				customRequest={customRequest}
				multiple
				{...props}
				showUploadList={false}>
				<Button size={"small"} icon={<UploadOutlined />}>
					Upload
				</Button>
			</Upload>
		</ImgCrop>
	);
};
