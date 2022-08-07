import React from "react";
import { connect } from "react-redux";
import {
  Steps,
  Popover,
  Button,
  Select,
  Typography,
  Space,
  Popconfirm,
  Modal,
  List,
} from "antd";
import { Row, Col } from "react-bootstrap";
import { Stages, StageEnum } from "../constants";
import { fetchActivities, startReview } from "../../../../../redux/actions";
import * as _ from "lodash";
import {
  getDateAndTime,
  getDateAndTimeAndZone,
  toLocaleDateString,
} from "../../../../../utils/dateUtils";
import { timeAgo } from "../../../../../utils/TimeAgo";
import { ClockCircleOutlined } from "@ant-design/icons";
import { hasOneOfTheRoles } from "../../../../../utils";
// should be renamed to evaluator
const { Step } = Steps;
const { Option } = Select;
const { Text } = Typography;
const keyedStages = _.keyBy(Stages, "label");
const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        step {index} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

class ProposalSteps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible: false,
      action: "",
      stepActions: [],
    };
  }

  componentDidMount = () => {
    const { proposalId } = this.props;
    this.setState({ loading: true });
    this.props.fetchActivities({ proposalId }).finally(() => {
      this.setState({ loading: false });
    });
  };

  getFinishStep = (stage) => {
    const { proposalId } = this.props;
    if (stage && stage.label) {
      const { label } = stage;
      console.log("getFinishStep stage", stage);
      console.log("getFinishStep label", label);
      console.log("getFinishStep stageEnum.Submitted", StageEnum.Submitted);
      switch (label) {
        case StageEnum.Submitted:
          console.log("getFinishStep", stage);
          this.props.startReview({ proposalId });
          break;
        case StageEnum.Reviewing:
          return;
        case StageEnum.Approval:
          return;
        case StageEnum.Acceptance:
          return;
        default:
          return () => {};
      }
    } else {
      alert("error!");
    }
  };

  renderStages = (dataObj) => {
    const { isProposalManager, currentStage } = dataObj;
    const { proposal } = this.props;
    return Stages.map((stage) => {
      return (
        <Step
          key={`${stage.label}`}
          title={stage.label || `Step ${stage.step}`}
          description={
            <Space direction={"vertical"}>
              {this.renderActivities({
                currStageStep: stage.step,
              })}
              {isProposalManager &&
              proposal &&
              proposal.currentStage == stage.step
                ? this.renderActions({ isProposalManager, currentStage, stage })
                : null}
            </Space>
          }
        />
      );
    });
  };

  renderActivities = (dataObj) => {
    const { currStageStep } = dataObj;
    const { activities } = this.props;
    console.log("PPStep activities", activities);
    const currStageActivities = _.filter(
      activities,
      (a) => a.stage === currStageStep
    );

    if (currStageActivities) {
      return (
        <Steps
          className="p-3"
          direction="vertical"
          current={currStageActivities.length}
          progressDot={customDot}
        >
          {currStageActivities.map((activity) => {
            const keyedUser = this.props.keyedUsers[activity.createdBy];
            const displayName =
              (keyedUser && keyedUser.displayName) ||
              (keyedUser && keyedUser.email);
            return (
              <Step
                key={`${activity.message}-key`}
                title={activity.action || "Action"}
                description={
                  <Space>
                    <Text mark>{`${displayName}`}</Text>
                    <Text type="secondary">{activity.message}</Text>
                    <Popover content={activity.created} title="Activity">
                      <Text type={"warning"}>
                        {timeAgo.format(Date.parse(activity.created))}
                      </Text>
                    </Popover>
                  </Space>
                }
              />
            );
          })}
        </Steps>
      );
    }
  };

  renderActions = (dataObj) => {
    const { isProposalManager, currentStage, stage } = dataObj;
    const { finish, actions } = stage;
    console.log("renderActions finish", stage);
    return (
      <Space direction={"vertical"}>
        {actions && actions.length > 0 ? (
          <Space className="d-flex flex-wrap">
            {actions.map((action) => {
              return (
                <Button
                  onClick={() => {
                    this.setState({
                      modalVisible: true,
                      stepActions: (actions && actions) || [],
                    });
                  }}
                >
                  {action.label || "Action Label"}
                </Button>
              );
            })}
          </Space>
        ) : null}
        {finish ? (
          <Popconfirm
            title={"Confirm?"}
            okText="OK"
            onConfirm={(e) => {
              console.log("onConfirm", e);
              // this.getFinishStep(stage);
              finish && finish.func && finish.func();
            }}
          >
            <Button type="primary">{finish.btnText}</Button>
          </Popconfirm>
        ) : null}
      </Space>
    );
  };
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  renderModalBody = (currentStage) => {
    const { stepActions } = this.state;
    const { proposal, proposalId } = this.props;
    console.log("stepActions", stepActions);
    switch (currentStage) {
      case 0:
        return (
          <List
            bordered
            dataSource={stepActions && stepActions}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>{item.label}</Typography.Text>
              </List.Item>
            )}
          />
        );
      case 1:
        return (
          <List
            size={"small"}
            bordered
            dataSource={stepActions && stepActions}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>
                  {item.label || "Action Label"}
                </Typography.Text>
                <Button
                  onClick={() => {
                    item.func && item.func({ proposalId });
                  }}
                >
                  Action
                </Button>
              </List.Item>
            )}
          />
        );
      case StageEnum.Reviewing:
        return null;
      case StageEnum.Approval:
        return null;
      case StageEnum.Acceptance:
        return null;
      default:
        return (
          <List
            bordered
            dataSource={[]}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text mark>[ITEM]</Typography.Text> {item}
              </List.Item>
            )}
          />
        );
    }
  };

  renderModal = () => {
    const { modalVisible, loading } = this.state;
    const { proposal } = this.props;
    const { currentStage } = proposal;
    return (
      <Modal
        width={"50%"}
        visible={modalVisible}
        title={"Actions"}
        onCancel={this.handleCancel}
        footer={null}
      >
        {this.renderModalBody(currentStage)}
      </Modal>
    );
  };

  render = () => {
    const { proposal } = this.props;
    console.log("PPStep props", this.props);
    const { authAccount } = this.props;
    const userRoles =
      authAccount && authAccount.private && authAccount.private.roles;
    const isProposalManager = hasOneOfTheRoles(
      ["admin", "super_admin", "proposal_admin"],
      userRoles
    );
    const { currentStage } = proposal;
    return (
      <div>
        {/* <Button size="large" className="my-3 btn-block" type="primary">
					Start Review
				</Button> */}
        <Steps direction={"vertical"} current={currentStage || 0}>
          {this.renderStages({ isProposalManager, currentStage })}
        </Steps>
        {this.renderModal()}
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    keyedUsers:
      (state.system && state.system.users && state.system.users.keyed) || {},
    authAccount: state.auth && state.auth.account,
  };
};

export default connect(mapStateToProps, { fetchActivities, startReview })(
  ProposalSteps
);
