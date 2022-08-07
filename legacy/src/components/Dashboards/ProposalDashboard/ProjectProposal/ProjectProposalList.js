import React from "react";
import { connect } from "react-redux";
import { BSNewButton } from "../../../ReusableComponents/Buttons/BSButton";
import { PageTitle } from "../../../ReusableComponents/Page";
import {
  Tabs,
  Modal,
  List,
  Card,
  Empty,
  Tag,
  Spin,
  Typography,
  Input,
  Checkbox,
  Collapse,
  Pagination,
  Popover,
} from "antd";
import { Row, Col, Container, Button } from "react-bootstrap";
import actions from "redux-form/lib/actions";
import ProjectProposalCreateForm from "./forms/ProjectProposalCreateForm";
import {
  submitProposal,
  fetchProposals,
} from "../../../../redux/actions/proposalActions";
import {
  FrownOutlined,
  BranchesOutlined,
  FileOutlined,
  SettingOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  ApartmentOutlined,
  SmileTwoTone,
  EnvironmentOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import * as _ from "lodash";
import { StatusCBs } from "./constants";
import FilterPanel from "./forms/FilterPanel";
import lunr from "lunr-mutable-indexes";
import { getFilteredResults } from "../../../../search/searchUtil";
import history from "../../../../history";
import ProposalFaqs from "../../../Features/Faqs/User/ProposalFaqs";

import CommentList from "./views/CommentList";
import { ProposalCard } from "./views/ProposalCard";
import { ProposalTableView } from "./views/ProposalTableView";

const { Title, Text, Paragraph, Link } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const ACTIONS = {
  CREATE_PROPOSAL: "CREATE_PROPOSALS",
  EDIT_PROPOSAL: "EDIT_PROPOSAL",
};

const VIEW_MODES = {
  TABLE: "TABLE",
  LIST: "LIST",
};

const searchIndex = lunr(function () {
  this.ref("uid");
  this.field("title");
  this.field("authors");
  this.field("description");
  this.field("branch");
  this.field("department");
});

class ProjectProposalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      modalVisible: false,
      action: "",
      proposals: [],
      filteredProposals: [],
      viewMode: VIEW_MODES.TABLE,
    };
  }

  fetchProposals = () => {
    this.setState({ loading: true });
    this.props
      .fetchProposals()
      .then(() => {
        const { proposals } = this.props;
        proposals && this.buildIndex(proposals);

        this.setState({
          proposals: proposals,
          filteredProposals: proposals,
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  componentDidMount = () => {
    this.fetchProposals();
  };

  componentDidUpdate = (prevProps) => {
    const currAccount = this.props.authAccount;
    const prevAccount = prevProps.authAccount;

    if (currAccount != null && prevAccount == null) {
      this.fetchProposals();
    }
  };

  buildIndex = (proposals) => {
    const { keyedBranches, keyedDepartments, keyedUsers } = this.props;
    proposals &&
      proposals.forEach((doc) => {
        const keyedBranch = keyedBranches[doc.branch];
        console.log("onSearch Proposal keyedBranch", keyedBranch);
        const branch = keyedBranch && [keyedBranch.label, keyedBranch.value];

        const keyedDepartment = keyedDepartments[doc.department];
        const department = keyedDepartment && [
          keyedDepartment.label,
          keyedDepartment.value,
        ];

        const coAuthors = doc.coAuthors;
        const authors = [];
        coAuthors.forEach((authorUid) => {
          const author = keyedUsers[authorUid];
          authors.push({ ...author });
        });
        const finalDoc = {
          ...doc,
          authors: authors && JSON.stringify([...authors]),
          branch: branch && JSON.stringify(branch).toLowerCase(),
          department: department && JSON.stringify(department).toLowerCase(),
        };
        console.log("onSearch Proposal finalDoc", finalDoc);
        searchIndex.add(finalDoc);
      });
    return;
  };

  submitProposal = (vals) => {
    console.log("submitProposal", vals);
    const { files } = vals;
    this.setState({ loading: true });
    this.props
      .submitProposal({ ...vals, files: [..._.map(files, "originFileObj")] })
      .then(() => {
        this.setState({ modalVisible: false, loading: false });
      })
      .catch((err) => {
        console.error("submitProposal failed", err);
      });
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  renderModalTitle = (action) => {
    switch (action) {
      case ACTIONS.CREATE_PROPOSAL:
        return "Create a Proposal";
      case ACTIONS.EDIT_PROPOSAL:
        return "Edit Proposal";
    }
  };

  renderModalBody = (action) => {
    const { branches, departments, users, currentUserId } = this.props;
    const { loading } = this.state;
    switch (action) {
      case ACTIONS.CREATE_PROPOSAL:
        return (
          <Spin spinning={loading}>
            <ProjectProposalCreateForm
              onFinish={this.submitProposal}
              onCancel={this.handleModalCancel}
              dataObj={{
                branches,
                departments,
                users: [
                  ..._.filter(users, (user) => {
                    return user.uid != currentUserId;
                  }),
                ],
              }}
            />
          </Spin>
        );
      case ACTIONS.EDIT_PROPOSAL:
        return "Edit Proposal";
    }
  };

  renderModal = () => {
    const { modalVisible, loading, action } = this.state;
    return (
      <Modal
        width={"60%"}
        visible={modalVisible}
        title={this.renderModalTitle(action)}
        onCancel={this.handleModalCancel}
        footer={null}
      >
        {this.renderModalBody(action)}
      </Modal>
    );
  };

  renderDate = (stringDate) => {
    console.log("renderDate", stringDate);
    if (stringDate) {
      const timezone = stringDate.substring(
        stringDate.indexOf("(") - 1,
        stringDate.indexOf(")") + 1
      );
      console.log("renderDate timezone", timezone);

      const parsedDate = Date.parse(stringDate);
      if (parsedDate) {
        const newDateObj = new Date(parsedDate);
        return (
          <>
            <b>{newDateObj.toDateString()}</b>
            <br />
            <span className="text-primary" style={{ fontSize: "11px" }}>
              {newDateObj.toLocaleTimeString()}
            </span>{" "}
            {timezone || "(No timezone)"}
          </>
        );
      }
    }
    return "Invalid Date";
  };

  renderProposalList = () => {
    const {
      branches,
      keyedBranches,
      keyedDepartments,
      keyedUsers,
    } = this.props;
    const { viewMode, filteredProposals, loading } = this.state;
    if (filteredProposals) {
      if (viewMode === VIEW_MODES.TABLE) {
        const configs = {
          keyedBranches,
          keyedDepartments,
          keyedUsers,
          data: filteredProposals,
        };
        return (
          <Spin spinning={loading}>
            <ProposalTableView {...configs} />
          </Spin>
        );
      } else if (viewMode === VIEW_MODES.LIST) {
        return (
          <Spin spinning={loading}>
            <List
              key={"uid"}
              className="i-proposal"
              grid={{ gutter: 16, column: 1 }}
              dataSource={filteredProposals}
              renderItem={(proposal) => {
                console.log("PPL ListItem", proposal);
                const configs = {
                  keyedBranches,
                  keyedDepartments,
                  keyedUsers,
                  proposal,
                };
                return (
                  <List.Item className="p-0">
                    <ProposalCard {...configs} />
                  </List.Item>
                );
              }}
            />
          </Spin>
        );
      }
    } else {
      return (
        <Card>
          <Empty
            description={
              <>
                <span className="mr-2">No proposals found</span>
                <FrownOutlined />
              </>
            }
          />
        </Card>
      );
    }
  };

  onSearch = (e) => {
    console.log("onSearch Proposal", e.target.value);
    const { proposals } = this.state;
    const filtered = getFilteredResults(e, searchIndex, proposals, "uid");
    console.log("onSearch filtered", filtered);
    this.setState({
      filteredProposals: [...filtered],
    });
  };

  render = () => {
    console.log("PPL: state", this.state);
    const { branches, departments } = this.props;
    const { loading, viewMode } = this.state;
    return (
      <div>
        <div className="mt-3">
          <Row>
            <Col>
              <Tabs type="card">
                <TabPane tab="Proposals" key="1">
                  <Row>
                    <Col xs={6}>
                      <BSNewButton
                        onClick={() => {
                          this.setState({
                            modalVisible: true,
                            action: ACTIONS.CREATE_PROPOSAL,
                          });
                        }}
                      />
                    </Col>
                    <Col className="d-flex justify-content-start mb-3" xs={6}>
                      <Popover content={"List View"}>
                        <Button
                          variant={
                            viewMode === VIEW_MODES.LIST ? "primary" : "default"
                          }
                          className="mr-2"
                          size="sm"
                          onClick={() => {
                            this.setState({
                              viewMode: VIEW_MODES.LIST,
                            });
                          }}
                        >
                          <UnorderedListOutlined />
                        </Button>
                      </Popover>
                      <Popover content={"Table View"}>
                        <Button
                          variant={
                            viewMode === VIEW_MODES.TABLE
                              ? "primary"
                              : "default"
                          }
                          className="mr-2"
                          size="sm"
                          onClick={() => {
                            this.setState({
                              viewMode: VIEW_MODES.TABLE,
                            });
                          }}
                        >
                          <TableOutlined />
                        </Button>
                      </Popover>
                      <Input
                        onChange={this.onSearch}
                        allowClear
                        placeholder={"Search ..."}
                        prefix={<SearchOutlined />}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={viewMode === VIEW_MODES.LIST ? 9 : 12}>
                      {this.renderProposalList()}
                    </Col>
                    {viewMode === VIEW_MODES.LIST ? (
                      <Col xs={3} className="pl-0">
                        <Spin spinning={loading}>
                          <Collapse
                            defaultActiveKey={["1"]}
                            onChange={() => {}}
                          >
                            <Panel
                              header={
                                <Text>
                                  <FilterOutlined className="mr-2" />
                                  Filters
                                </Text>
                              }
                              key="1"
                            >
                              <FilterPanel
                                onFinish={(vals) => {
                                  console.log("onFilter vals", vals);
                                }}
                                onCancel={() => {}}
                                dataObj={{
                                  branches,
                                  departments,
                                  status: [...StatusCBs],
                                }}
                              />
                            </Panel>
                          </Collapse>
                        </Spin>
                      </Col>
                    ) : (
                      <></>
                    )}
                  </Row>
                </TabPane>
                <TabPane tab="FAQ" key="2">
                  {
                    //Content of Tab Pane 3
                  }
                  <ProposalFaqs />
                </TabPane>
              </Tabs>
            </Col>
          </Row>
          {this.renderModal()}
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    branches:
      (state.system && state.system.branches && state.system.branches.data) ||
      [],
    keyedBranches:
      (state.system && state.system.branches && state.system.branches.keyed) ||
      {},
    departments:
      (state.system &&
        state.system.departments &&
        state.system.departments.data) ||
      [],
    keyedDepartments:
      (state.system &&
        state.system.departments &&
        state.system.departments.keyed) ||
      {},
    users:
      (state.system && state.system.users && state.system.users.data) || [],
    currentUserId: state.auth && state.auth.account && state.auth.account.uid,
    fetchedProposals: [],
    faqs: state.system.proposalFaq,
    proposals: (state.proposal && state.proposal.proposals) || [],
    keyedUsers:
      (state.system && state.system.users && state.system.users.keyed) || {},
    authAccount: state.auth && state.auth.account,
  };
};

export default connect(mapStateToProps, {
  submitProposal,
  fetchProposals,
})(ProjectProposalList);
