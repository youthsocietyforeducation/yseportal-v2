import lunr from "lunr-mutable-indexes";
export const LEFT_NAV_SEARCH_INDEX = lunr(function () {
	this.ref("title");
	this.field("title");
	this.field("children");
});
