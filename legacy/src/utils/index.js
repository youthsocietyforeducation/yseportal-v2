import * as _ from "lodash";
import fb from "../firebase";
import { result } from "lodash";
/**
 * finds whether role exists in roles.
 * returns true if so, false otherwise.
 * @param {the role you want to check in role-array} role
 * @param {the role array that the user has} roles
 */
export const hasRole = (role, roles) => {
	if (roles.indexOf(role) !== -1) {
		return true;
	} else {
		return false;
	}
};

/**
 * this function checks whether you have one of the roles available
 * @param {one of the roles that are needed. an array of roles} oneOfNeededRoles
 * @param {an array of roles that you have} rolesYouHave
 */

export const hasOneOfTheRoles = (oneOfNeededRoles, rolesYouHave) => {
	for (let i = 0; i < oneOfNeededRoles.length; i++) {
		if (rolesYouHave && rolesYouHave.indexOf(oneOfNeededRoles[i]) !== -1) {
			return true;
		}
	}
	return false;
	// oneOfNeededRoles.forEach((r) => {
	//   alert(rolesYouHave);
	//   if (hasRole(r, rolesYouHave)) {
	//     console.log('hasOneOfTheROles', 'Enterning if');
	//     return true;
	//   }
	// });
	// return false;
};

export const hasOneOfTheRoleObjs = (oneOfNeededRoles, rolesYouHave) => {
	for (let i = 0; i < oneOfNeededRoles.length; i++) {
		if (
			rolesYouHave &&
			rolesYouHave.map((role) => role.role).indexOf(oneOfNeededRoles[i]) !== -1
		) {
			return true;
		}
	}
	return false;
};

/**
 * this function removes empty key values from the object itself
 * @param {the obj to iterate over for the keys} obj
 * return void
 */
export const removeEmptyKeyFromObj = (obj) => {
	console.log("removeEmptyKeyFromObj: ", obj);
	var newObj = {};
	Object.keys(obj).forEach((key) => {
		console.log("removeEmptyKeyFromObj: key: ", key, "obj", obj[key]);
		var isEmpty =
			obj[key] === undefined || obj[key] === null || obj[key] === "";
		if (isEmpty) {
			delete obj[key];
		} else {
			newObj[key] = obj[key];
		}
	});
	console.log("removeEmptyKeyFromObj: ", newObj);
	return newObj;
};

export const search = (objectArray, searchTerm) => {};

export const getFullName = (profile) => {
	if (profile) {
		const { firstName, lastName } = profile;
		if (firstName && lastName) {
			return `${firstName} ${lastName}`;
		}
		return "No Full Name";
	}
};
export const containsInObjectArrayField = (objArr, field, val) => {
	if (objArr && field && val) {
		var boolFlag = false;
		objArr.forEach((o) => {
			if (o[field] === val) {
				boolFlag = true;
			}
		});
		return boolFlag;
	}
	return false;
};

export const getField = (passedObj) => {
	const { id, field, keyedObj } = passedObj;
	if (id && field && keyedObj) {
		const obj = keyedObj[id];
		if (obj[field]) {
			return obj[field];
		}
	}
	return "";
};

export const addField = (arr, newFieldName, fieldValue) => {
	if (arr) {
		let results = arr.map((o) => {
			o[newFieldName] = o[fieldValue];
			console.log("addField", o);
			return o;
		});
		return results;
	}
};

export const pickFields = (arr, fieldsToKeep) => {
	if (arr) {
		return arr.map((o) => {
			return _.pick(o, [...fieldsToKeep]);
		});
	}
};
