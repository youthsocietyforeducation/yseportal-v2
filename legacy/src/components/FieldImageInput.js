import React, { Component } from "react";

export default class FieldImageInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			props: props,
			previewImage: null,
			currentFiles: [],
			previousFiles: [],
		};
	}

	componentDidMount = () => {
		console.log("FieldImageInput: ", this.props);
		if (this.props.previousFiles) {
			console.log("FieldImageInput: ", this.props.previousFiles);
			this.setState({
				previousFiles: [...this.props.previousFiles],
			});
		}
	};

	onChange = (e) => {
		e.preventDefault();
		const { onChange } = this.state.props;
		let reader = new FileReader();
		reader.onload = (r) => {
			console.log("FieldImageInput: reader.onload", r);
			this.setState({
				previewImage: r.target.result,
			});
		};

		reader.readAsDataURL(e.target.files[0]);

		console.log("FieldImageInput, onchange", e.target.files);
		this.setState({
			currentFiles: Array.from(e.target.files),
		});
		console.log("FieldImageInput", e.target);
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
		let currentFiles = this.state.currentFiles;
		let previousFiles = this.state.previousFiles;
		console.log("FieldImageInput: renderDisplay", previousFiles);
		return (
			<div className="uploaded-file-window mt-3">
				<h5>Image to be uploaded</h5>
				<ul>
					{currentFiles.length > 0 ? (
						currentFiles.map((file, i) => {
							return (
								<li key={i}>
									<img
										className="img-fluid"
										src={this.state.previewImage}
										aria-hidden
										alt="preview profile picture"
									/>
									<p>{file.name}</p>
								</li>
							);
						})
					) : (
						<li>No files attached yet</li>
					)}
				</ul>
			</div>
		);
	};

	render() {
		const { label, input } = this.props;
		return (
			<div>
				<div>
					{label && <h5 className="text-primary">{label}</h5>}
					<input
						type="file"
						accept=".jpg, .png, .jpeg"
						onChange={this.onChange}
					/>
					<p>
						<small>Accepts: .jpg, .png, .jpeg</small>
					</p>
					{this.renderDisplay()}
				</div>
			</div>
		);
	}
}
