import React from "react";
import { connect } from "react-redux";
import { Form, Input, Button, Spin, List, Avatar } from "antd";
import {
	insertComment,
	fetchComments,
} from "../../../../../redux/actions/proposalActions";
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { formatDate } from "../../../../../redux/actions/util";
import { timeAgo } from "../../../../../utils/TimeAgo";
class CommentList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
		};
	}

	componentDidMount = () => {
		const { proposalId } = this.props;
		this.setState({ loading: true });
		this.props.fetchComments({ proposalId }).finally(() => {
			this.setState({ loading: false });
		});
	};

	renderComments = () => {
		const { comments, keyedUsers } = this.props;
		return (
			<div className="overflow-auto mt-3 border border-default rounded">
				<List
					itemLayout="horizontal"
					dataSource={comments || []}
					renderItem={(comment) => {
						const userProfile = keyedUsers && keyedUsers[comment.author];
						const profileImageURL = userProfile && userProfile.profileImageURL;
						const displayName =
							(userProfile && userProfile.displayName) ||
							(userProfile && userProfile.email) ||
							"";
						const updated =
							timeAgo.format(Date.parse(comment.updated)) || "Invalid Date";
						return (
							<List.Item key={comment.uid}>
								<List.Item.Meta
									className="p-2"
									avatar={
										profileImageURL ? (
											<Avatar src={profileImageURL || ""} />
										) : (
											<Avatar icon={<UserOutlined />} />
										)
									}
									title={
										<div className="d-flex justify-content-between">
											<span>{displayName}</span>
											<span className="text-muted">{updated}</span>
										</div>
									}
									description={comment.comment || ""}
								/>
							</List.Item>
						);
					}}
				/>
			</div>
		);
	};

	onInsert = (vals) => {
		console.log("CommentList onInsert", vals);
		const { proposalId, proposal } = this.props;
		this.setState({ loading: true });
		this.props
			.insertComment({ proposalId, data: vals, proposal })
			.finally(() => {
				this.setState({ loading: false });
			});
	};

	render = () => {
		const { comments } = this.props;
		return (
			<Spin spinning={this.state.loading}>
				<CommentForm onFinish={this.onInsert} />
				{this.renderComments()}
			</Spin>
		);
	};
}

const CommentForm = ({ onFinish }) => {
	const [form] = Form.useForm();
	return (
		<Form
			form={form}
			layout="vertical"
			onFinish={(vals) => {
				onFinish && onFinish(vals);
				form.resetFields();
			}}>
			<Form.Item
				name="comment"
				rules={[
					{
						required: true,
						message: "Please comment something!",
					},
				]}>
				<Input.TextArea rows={3} allowClear />
			</Form.Item>
			<Button htmlType={"submit"} className="btn-block">
				Post
			</Button>
		</Form>
	);
};

const mapStateToProps = (state) => {
	return {
		keyedUsers:
			(state.system && state.system.users && state.system.users.keyed) || {},
	};
};

export default connect(mapStateToProps, { insertComment, fetchComments })(
	CommentList
);
