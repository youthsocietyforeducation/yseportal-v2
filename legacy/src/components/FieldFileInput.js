import React, { Component } from "react";

export default class FieldFileInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			props: props,
			currentFiles: [],
			previousFiles: [],
		};
	}

	componentDidMount = () => {
		console.log("FieldFileInput: ", this.props);
		if (this.props.previousFiles) {
			console.log("FieldFileInput: ", this.props.previousFiles);
			this.setState({
				previousFiles: [...this.props.previousFiles],
			});
		}
	};

	onChange = (e) => {
		e.preventDefault();
		const { onChange } = this.state.props;
		// console.log(this.state.props)
		// console.log(e.target.files);
		console.log("FieldFileInput, onchange", e.target.files);
		this.setState({
			currentFiles: Array.from(e.target.files),
		});
		onChange(e.target.files);
	};

	renderPreviousFiles = (previousFiles) => {
		console.log("renderPreviousFiles: ", previousFiles);
		if (previousFiles && previousFiles.length > 0) {
			console.log("inside initialFieles renderPreviosFiles: ", previousFiles);
			return (
				<div>
					<hr />
					<h5>Previous Files</h5>
					<ul>
						{previousFiles.map((file, i) => (
							<li key={i}>
								<a
									href={file.downloadURL}
									target="_blank"
									rel="noopener noreferrer">
									{file.fileName}
								</a>
							</li>
						))}
					</ul>
				</div>
			);
		} else {
			return <></>;
		}
	};

	renderDisplay = () => {
		// console.log("render display: ", this.state.props);
		// console.log("render display: ", this.state.currentFiles);
		let currentFiles = this.state.currentFiles;
		let previousFiles = this.state.previousFiles;
		console.log("FieldFileInput: renderDisplay", previousFiles);
		return (
			<div className="uploaded-file-window">
				<h5>Files to be uploaded</h5>
				<ul>
					{currentFiles.length > 0 ? (
						currentFiles.map((file, i) => {
							// console.log(file)
							return (
								<li key={i}>
									<p>{file.name}</p>
								</li>
							);
						})
					) : (
						<li>No files attached yet</li>
					)}
				</ul>

				{this.renderPreviousFiles(previousFiles)}
			</div>
		);
	};

	render() {
		const { input, label } = this.props; //whatever props you send to the component from redux-form Field
		// meta,
		return (
			<div>
				<label>{label}</label>
				<div>
					<input
						multiple
						type="file"
						accept=".jpg, .png, .jpeg, application/doc, application/docx, application/pdf"
						onChange={this.onChange}
					/>
					<p>
						<small>Accepts: .jpg, .png, .jpeg, .doc, .docx, .pdf</small>
					</p>
					{this.renderDisplay()}
				</div>
			</div>
		);
	}
}
