import React from "react";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

export default class AntDUploadPreview extends React.Component {
	state = {
		fileList: [],
		uploading: false,
	};

	handleUpload = () => {
		const { fileList } = this.state;
		const formData = new FormData();
		fileList.forEach((file) => {
			formData.append("files[]", file);
		});

		this.setState({
			uploading: true,
		});
	};

	render() {
		const { fileList } = this.state;
		const props = {
			multiple: true,
			onRemove: (file) => {
				this.setState((state) => {
					const index = state.fileList.indexOf(file);
					const newFileList = state.fileList.slice();
					newFileList.splice(index, 1);
					return {
						fileList: newFileList,
					};
				});
			},
			beforeUpload: (file) => {
				this.setState((state) => ({
					fileList: [...state.fileList, file],
				}));
				return false;
			},
			fileList,
		};

		return (
			<>
				<Upload.Dragger
					{...this.props}
					accept={
						".jpg, .png, .jpeg, application/doc, application/docx, application/pdf"
					}
					{...props}>
					<p className="ant-upload-drag-icon">
						<InboxOutlined />
					</p>
					<p className="ant-upload-text">
						Click or drag file to this area to upload
					</p>
					<p className="ant-upload-hint">
						Support for a single or bulk upload.
					</p>
				</Upload.Dragger>
			</>
		);
	}
}
