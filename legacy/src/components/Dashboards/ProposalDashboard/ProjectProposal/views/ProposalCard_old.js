import React from 'react';
import { connect } from 'react-redux';
import {
  getStatusColor,
  renderAuthorTags,
  renderFileIcons,
  getStatusBackgroundColor,
  containsAuthor,
  renderPrimaryAuthorTag,
} from '../controls/processor';
import { containsInObjectArrayField } from '../../../../../utils';
import { Tag, Tooltip, Button, Badge } from 'element-react';
import { Link } from 'react-router-dom';
import { Status } from '../constants';
import ProposalDialog from './ProposalDialog';
import { stat } from 'fs';

class ProposalCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {};

  renderDate = (stringDate) => {
    console.log('renderDate', stringDate);
    if (stringDate) {
      const timezone = stringDate.substring(
        stringDate.indexOf('(') - 1,
        stringDate.indexOf(')') + 1
      );
      console.log('renderDate timezone', timezone);

      const parsedDate = Date.parse(stringDate);
      if (parsedDate) {
        const newDateObj = new Date(parsedDate);
        return (
          <>
            <b>{newDateObj.toDateString()}</b>
            <br />
            <span className="text-primary" style={{ fontSize: '11px' }}>
              {newDateObj.toLocaleTimeString()}
            </span>{' '}
            {timezone || '(No timezone)'}
          </>
        );
      }
    }
    return 'Invalid Date';
  };

  openEditDialog = (val) => {
    console.log('openEditDialog', val);
    this.setState({ dialogVisible: val });
  };

  render = () => {
    const { proposal } = this.props;
    console.log('card: proposal', proposal);
    if (proposal) {
      let status = proposal.status.toString().toUpperCase();
      const isAuthor = proposal.authors.indexOf(this.props.currUserId) != -1;
      const branch = proposal.branch;
      const department = proposal.department;
      const description = proposal.description;
      const files = proposal.files;
      const isEditable = proposal.isEditable;
      const isFinalized = proposal.isFinalized;
      return (
        <div className="i-pp-list projectProposal border mt-2 rounded p-3">
          <div className="row">
            <div className="col-sm-12 d-flex justify-content-between vertical-align-middle">
              <h5 className="i-element-light-black m-0 mr-2">
                {proposal.title}
                <span className="ml-2 infinite" hidden={!isEditable}>
                  <Tag color="#ffa931">
                    <i className="fas fa-edit"></i>
                    {}
                  </Tag>
                </span>
              </h5>
              <Tag
                type={getStatusColor(status)}
                color={
                  status === Status.ACCEPTED
                    ? getStatusBackgroundColor(status)
                    : ''
                }
              >
                <i className="fas fa-sync-alt mr-2"></i>
                {proposal.status.toString().toUpperCase()}
              </Tag>
            </div>
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-10">
                  <div className="d-flex justify-content-start flex-wrap mt-2">
                    <Tooltip
                      className="item mr-2 mb-2"
                      effect="dark"
                      content={branch}
                      placement="top-end"
                    >
                      <Tag color="#4f8a8b">
                        <i className="fas fa-code-branch mr-2"></i>
                        {branch}
                      </Tag>
                    </Tooltip>
                    <Tooltip
                      className="item mr-2 mb-2"
                      effect="dark"
                      content={department}
                      placement="top-end"
                    >
                      <Tag color="#fb7813">
                        <i className="fas fa-building mr-2"></i>
                        {department}
                      </Tag>
                    </Tooltip>
                    {renderPrimaryAuthorTag(
                      proposal.createdBy,
                      this.props.sysUsers
                    )}
                    {/* {renderAuthorTags(
                      proposal.createdBy,
                      proposal.authors,
                      this.props.sysUsers
                    )} */}
                  </div>
                  <h6 className="text-muted subtitle mb-2">{description}</h6>
                  <div className="d-flex justify-content-start flex-wrap mb-2">
                    {renderFileIcons(files)}
                  </div>
                </div>
                <div className="col-sm-2">
                  <span hidden={!this.props.showView}>
                    <Link to={`/proposals/${proposal.uid}`}>
                      <Button type="primary" className="w-100 mt-2">
                        View<i className="ml-2 fas fa-arrow-circle-right"></i>
                      </Button>
                    </Link>
                  </span>
                  <span hidden={!(isAuthor && isEditable && !isFinalized)}>
                    <Link to={`/proposals/${proposal.uid}/edit`}>
                      <Button
                        onClick={(val) => {
                          return; /* this.props.edit() */
                        }}
                        type="warning"
                        className="w-100 mt-2"
                      >
                        Edit<i className="ml-2 fas fa-edit"></i>
                      </Button>
                    </Link>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-sm-12 d-flex justify-content-between">
              <small>Submitted on: {this.renderDate(proposal.created)}</small>
              <small className="text-right">
                Last Updated: {this.renderDate(proposal.updated)}
              </small>
            </div>
          </div>
          {/* <ProposalDialog onCancel={() => this.openEditDialog(false)} proposal={this.props.proposal}
                    dialogTitle={"Edit Proposal"} dialogVisible={this.state.dialogVisible}/> */}
        </div>
      );
    } else {
      return <></>;
    }
  };
}

const mapStateToProps = (state) => {
  return {
    currUserId: state.auth.user.uid,
  };
};

export default connect(mapStateToProps, {})(ProposalCard);
