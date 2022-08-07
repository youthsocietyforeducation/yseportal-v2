import { fb, db } from "../../../firebase";

export const getSubCollectionsWithPath = (path, subCollection) => {
	const ref = db.doc(path).collection(subCollection);
	return ref.get().then((snapshot) => {
		let docs = [];
		console.log("activities getSubCollectionsWithPath snapshot", snapshot);
		docs = snapshot.docs.map((doc) => {
			console.log("activities getSubCollectionsWithPath doc", doc);
			return doc.data();
		});
		return Promise.resolve(docs);
	});
};

export const insertSubCollection = (configs) => {
	const { path, subCollection, data } = configs;
	if (path && subCollection && data) {
		const ref = db.doc(path).collection(subCollection).doc();
		const refId = ref.id;
		return ref.set({ ...data, uid: refId }, { merge: true });
	} else {
		return Promise.reject();
	}
};

export const formatDate = (date) => {
	const timezone = date.substring(date.indexOf("(") - 1, date.indexOf(")") + 1);
	const newDateObj = new Date(Date.parse(date));
	return `${newDateObj.toDateString()} ${newDateObj.toLocaleTimeString()} ${timezone}`;
};

export const getUpdateMeta = () => {
	const updated = new Date().toString();
	const updatedBy = fb.auth().currentUser.uid;
	return { updated, updatedBy };
};

export const getDefaultMetaFields = () => {
	const created = new Date().toString();
	const createdBy = fb.auth().currentUser.uid;
	const updated = created;
	const updatedBy = createdBy;

	return { created, createdBy, updated, updatedBy };
};

export const getFullName = (profile) => {
	const { firstName, lastName } = profile;
	if (firstName && lastName) {
		return `${firstName} ${lastName}`;
	}
	return "No Full Name";
};

export const getUserRolesFromState = (state) => {
	const {
		auth: { account },
	} = state;
	if (account && account.private && account.private.roles) {
		return account.private.roles;
	}
	return [];
};

export const getUnSubsFromState = (state) => {
	const {
		system: { unsubs },
	} = state;
	if (unsubs && unsubs.length > 0) {
		return unsubs;
	}
	return [];
};

export * from "./uploadActions";
