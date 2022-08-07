// always expects a "toString()-ed" date
// example: new Date().toString() is the input

import firebase from 'firebase'

export const getDateAndTimeAndZone = (date) => {
	const timezone = date.substring(date.indexOf("(") - 1, date.indexOf(")") + 1);
	const newDateObj = new Date(Date.parse(date));
	return `${newDateObj.toDateString()} ${newDateObj.toLocaleTimeString()} ${timezone}`;
};

export const getDateAndTime = (date) => {
	const newDateObj = new Date(Date.parse(date));
	return `${newDateObj.toLocaleString()}`;
};

export const getShortDateAndTimeAndZone = (date) => {
	const timezone = date.substring(date.indexOf("(") - 1, date.indexOf(")") + 1);
	const newDateObj = new Date(Date.parse(date));
	return `${newDateObj.toDateString()} ${newDateObj.toLocaleTimeString()} ${timezone}`;
};

export const toLocaleDateString = (date) => {
	const newDateObj = new Date(Date.parse(date));
	return `${newDateObj.toLocaleDateString()}`;
};

export const getFirebaseTimeStamp = (date) => {
	return firebase.firestore.Timestamp.fromDate(date);
}