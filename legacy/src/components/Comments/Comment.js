import React, { Component } from "react";
import { getComments, insertComment } from "../../redux/actions";
import { connect } from "react-redux";
// import { stat } from 'fs';
import { Button, Card, Message } from "element-react";
import { getFullName } from "../../utils";
class Comment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
			collection: this.props.collection,
			collectionId: this.props.collectionId,
			comments: this.props.comments,
			insert: () => {},
		};
	}

	componentDidMount = () => {
		const { collection, collectionId, comments, insert } = this.props;
		this.setState({
			collection,
			collectionId,
			comments,
			insert,
		});
		// console.log("INFO: componentDidMount: Comment.js", this.props.selectedProposalId)
		// this.props.getComments({collection, collectionId});
	};

	handleSubmit = (event) => {
		event.preventDefault();
		const { insert } = this.state;
		let form = event.target;
		let comment = form.comment.value.trim();
		if (comment !== "") {
			// if possible sanitize here
			insert && insert(comment);
			form.comment.value = "";
		} else {
			Message({
				message: "Comment is empty.",
				type: "warning",
			});
		}

		// console.log("comment: ", comment, "userId: ", authorId, "collection: ", collection, collectionId);
	};

	renderComments = () => {
		// console.log("INFO: renderComments(): Comment.js: ", this.props.proposals)
		// let proposals = this.props.proposals;
		// let comments = proposals.readableComments;
		// console.log(comments);
		const { comments } = this.props;
		console.log("renderComments", comments);
		if (comments) {
			// console.log(comments)
			return comments.map((comment, index) => {
				const author = getFullName(this.props.keyedSysUsers[comment.updatedBy]);
				const sameAuthor = this.props.currUserId === comment.updatedBy;
				return (
					<Card key={index} className="mb-1" bodyStyle={{ padding: "15px" }}>
						{sameAuthor ? (
							<small className="text-primary font-weight-bold">{author}</small>
						) : (
							<small className="text-muted font-weight-bold">{author}</small>
						)}
						<p>{comment.comment}</p>
						<small className="text-muted">{comment.updatedDate}</small>
					</Card>
				);
			});
		} else {
			return (
				<div className="comment">
					<p>No comments added yet.</p>
				</div>
			);
		}
	};

	render() {
		return (
			<div className="input">
				<div className="i-comment-window">
					<form className="comment-form mb-4" onSubmit={this.handleSubmit}>
						<textarea
							rows="3"
							className="form-control"
							placeholder="Enter your comment"
							name="comment"
						/>
						<Button nativeType="submit" className="btn-block mt-2">
							Post Comment
						</Button>
					</form>
					<div className="comment-display">{this.renderComments()}</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	// console.log("INFO: ", state);
	return {
		account: state.auth.account,
		proposals: state.proposal,
		currUserId: state.auth.user.uid,
		keyedSysUsers: state.system.keyedSysUsers,
	};
};
export default connect(mapStateToProps, { insertComment, getComments })(
	Comment
);
