/**
 * Author: Kaung Yang
 * Created: May 12th 2020
 * Updated: May 12th 2020
 */

import React from "react";
import { renderError } from "../controls/renderError";
import { Input, Select, Tooltip, Tag, Loading } from "element-react";
import * as _ from "lodash";
// import MaterialAutoComplete from "../../../../ReusableComponents/MaterialAutoComplete";
import UploadFile from "../../../../ReusableComponents/UploadFile/UploadFile";
import { renderFileIcons } from "../controls/processor";

export const renderField = (props) => {
	const { input, fields } = props;
	const {
		meta: { touched, error },
	} = props;
	console.log("renderField PPF", props.meta);
	return (
		<div className="form-group">
			{input && !fields ? renderInput(props) : <></>}
			{fields && !input ? renderArrayInput(props) : <></>}
			{renderError(touched, error)}
		</div>
	);
};

const notifyResults = (values, fields) => {
	console.log("material ", "handleSelectedValues ", values);
	fields.removeAll();
	values.forEach((e) => {
		console.log("material: notifyResults", e);
		fields.push(e);
	});
	console.log("material ", "fields", fields);
};

export const initializeAuthors = (bank, initialValues) => {
	console.log("PPFORM: initializeAuthors bank", bank);
	console.log("PPFORM: initializeAuthors initialValues", initialValues);
	if (initialValues) {
		const initialUids = initialValues.map((author) => author.uid);
		const matched = [];
		console.log(
			"PPFORM: notifyResults, initializeAuthors initialUids",
			initialUids
		);
		initialUids.forEach((uid) => {
			const index = bank
				.map((e) => {
					return e.uid;
				})
				.indexOf(uid);
			console.log("PPFORM: notifyResults, initializeAuthors index", index);
			console.log("PPFORM: notifyResults, initializeAuthors bank", bank[index]);
			bank[index] && matched.push(bank[index]);
		});
		console.log("PPFORM: notifyResults, initializeAuthors matched", matched);
		return matched;
	}
};

const renderPreviousAuthors = (props) => {
	const { initialValues } = props;
	if (
		initialValues &&
		initialValues.authors &&
		initialValues.authors.length > 0
	) {
		console.log("renderPreviousAuthors: ", initialValues.authors);
		return initialValues.authors.map((a) => {
			console.log("renderPreviousAuthors: a", a);
			console.log("renderPreviousAuthors: a", a.email);
			return (
				<Tag className="mb-2 mr-2" type="primary">
					{a.email}
				</Tag>
			);
		});
	} else {
		return <Loading></Loading>;
	}
};

const renderArrayInput = (props) => {
	const {
		fields,
		placeholder,
		label,
		otherData,
		initialValues,
		defaultValues,
	} = props;
	console.log("PPFORM renderArrayInput: otherData", otherData);
	console.log("PPFORM renderArrayInput: props", props);
	switch (fields.name) {
		// case inputFields.AUTHORSX:
		//   const initVals = initialValues && initialValues.authors;
		//   console.log("PPFORM renderArrayInput props.defaultValue", defaultValues);
		//   return(
		//     <div className="form-group">
		//         <label className="">{label}</label>
		//         <MaterialAutoComplete placeholder={placeholder} title={"email"}
		//           defaultValues={defaultValues.authors}
		//           searchBank={otherData} notifyResults={ (values) => {notifyResults(values, fields)} }/>
		//     </div>
		//   );
		case inputFields.AUTHORS: // use this
			// const initVals = initialValues && initialValues.authors;
			console.log("PPFORM renderArrayInput props.defaultValue", defaultValues);
			console.log("PPFORM renderArrayInput props.initialValues", initialValues);

			if (defaultValues && defaultValues.authors) {
				return (
					<div>
						<div className="form-group">
							<label className="">{label}</label>
							{/* <ElementAutoComplete defaultVals={defaultValues.authors} bank={otherData} field={"email"} className="w-100"/> 
              <br/> */}
							{/* { initialValues && initialValues.authors && initialValues.authors.length > 0 ? 
                renderPreviousAuthors(initialValues.authors) : <></> } */}
							{/* <div className="d-flex justify-content-start">{ renderPreviousAuthors(props) }</div> */}
							{/* <MaterialAutoComplete
								placeholder={placeholder}
								title={"email"}
								defaultValues={
									defaultValues && defaultValues.authors
										? defaultValues.authors
										: []
								}
								searchBank={otherData}
								notifyResults={(values) => {
									notifyResults(values, fields);
								}}
							/> */}
						</div>
					</div>
				);
			} else {
				return (
					<div className="form-group">
						<label className="">{label}</label>
						{/* <MaterialAutoComplete
							placeholder={placeholder}
							title={"email"}
							defaultValues={[]}
							searchBank={otherData}
							notifyResults={(values) => {
								notifyResults(values, fields);
							}}
						/> */}
					</div>
				);
			}
	}
};

const renderPreviousFiles = (props) => {
	const { initialValues } = props;
	if (initialValues && initialValues.files && initialValues.files.length > 0) {
		return (
			<div className="p-2">
				<p className="mb-0">Previous Files</p>
				<small>Note: submitted files cannot be modified</small>
				<div className="d-flex justify-content-start">
					{/* { initialValues.files.map(f => { return <a src={f.downloadURL}><Tag className="mb-2 mr-2">{f.fileName}</a></Tag>})} */}
					{renderFileIcons(initialValues.files)}
				</div>
			</div>
		);
	} else {
		return <></>;
	}
};

const renderInput = (props) => {
	const {
		input,
		label,
		placeholder,
		disabled,
		otherData,
		initialValues,
	} = props;
	switch (input.name) {
		case inputFields.TITLE:
			return (
				<div>
					<label className="">
						<span className="text-danger">*</span>
						{label}
					</label>
					<Input {...input} size="large" placeholder={placeholder} />
				</div>
			);
		case inputFields.DESCRIPTION:
			return (
				<div>
					<label className="">
						<span className="text-danger">*</span>
						{label}
					</label>
					<Input
						{...input}
						size="large"
						type="textarea"
						autosize={{ minRows: 2, maxRows: 6 }}
						placeholder={placeholder}
					/>
				</div>
			);
		case inputFields.BRANCH:
			console.log("renderField branch", otherData);
			return (
				<div>
					<label className="d-block">
						<span className="text-danger">*</span>
						{label}
					</label>
					<Select {...input} className="w-100" size="large">
						{otherData ? (
							otherData.map((el) => {
								return (
									<Select.Option
										key={el.value}
										label={el.label}
										value={el.value}
									/>
								);
							})
						) : (
							<></>
						)}
					</Select>
				</div>
			);
		case inputFields.DEPARTMENT:
			return (
				<div>
					<label className="d-block">
						<span className="text-danger">*</span>
						{label}
					</label>
					<Select {...input} className="w-100" size="large">
						{otherData ? (
							otherData.map((el) => {
								return (
									<Select.Option
										key={el.value}
										label={el.label}
										value={el.value}
									/>
								);
							})
						) : (
							<></>
						)}
					</Select>
				</div>
			);
		case inputFields.FILES:
			console.log("ppfile: initialValues", props);
			return (
				<div className="form-group">
					<label className="d-block">
						<span className="text-danger">*</span>
						{label}
					</label>
					<UploadFile
						{...input}
						multiple={true}
						accept="image/png, image/jpeg, .pdf, .doc, .jpg"
					/>

					{renderPreviousFiles(props)}
				</div>
			);
		default:
			return <input />;
	}
};

const inputFields = {
	TITLE: "title",
	DESCRIPTION: "description",
	BRANCH: "branch",
	DEPARTMENT: "department",
	AUTHORS: "authors",
	FILES: "files",
};

export default renderField;
