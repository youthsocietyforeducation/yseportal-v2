import { BANNED_LETTERS } from "./constants";

export const getSearchTerm = (e) => {
	let searchTerm = e.target.value || "";
	BANNED_LETTERS.forEach((letter) => {
		if (searchTerm.includes(letter)) {
			searchTerm = "";
		}
	});
	let tempWord = searchTerm;
	if (tempWord.length > 2) {
		tempWord = searchTerm.substring(0, searchTerm.length - 2);
	}
	const wildSearchTerm = "*" + tempWord + "*";
	// const boostedSearchTerm = `${searchTerm}^10`;
	const boostedSearchTerm = "";
	const realSearchTerm = wildSearchTerm + " " + boostedSearchTerm;
	return realSearchTerm;
};

export const getFilteredResults = (e, index, objOriginalState, refField) => {
	const searchTerm = getSearchTerm(e) || "";
	const searchResults = index.search(searchTerm);
	let filtered = objOriginalState.filter((obj) => {
		const ref = obj[refField];
		const results = searchResults.map((searchItem) => {
			return searchItem.ref;
		});
		return results.includes(ref);
	});
	return filtered || [];
};
