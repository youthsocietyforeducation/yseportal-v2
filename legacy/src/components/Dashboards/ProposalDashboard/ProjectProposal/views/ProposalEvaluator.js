import React from 'react';
import {
  Steps,
  Button,
  Dropdown,
  Popover,
  Switch,
  Alert,
  Table,
  Loading,
  Message,
  MessageBox,
  Notification,
  Tooltip,
} from 'element-react';
import Evaluator from './Evaluator';
import { connect } from 'react-redux';
import {
  updateField,
  logActivity,
  getActivities,
} from '../../../../../redux/actions';
import { Status, PROPOSALS } from '../constants';
import { HighlightSpanKind } from 'typescript';
import { getField } from '../../../../../utils';

class ProposalEvaluator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      visible: false,
      buttonDisabled: false,
      loading: false,
      proposal: {},
      nextButtonsDisabled: [
        false,
        true,
        true && !this.decisionMade(this.props.proposal),
      ],
      actionsLoading: false,
      actionsTable: [
        {},
        {
          columns: [
            {
              label: 'Actions',
              prop: 'actions',
              render: (data, col, index) => {
                return (
                  <span>
                    <Tooltip
                      className="d-inline-block"
                      effect="dark"
                      content={data.information || ''}
                      placement="right"
                    >
                      <i className="el-icon-information mr-2"></i>
                    </Tooltip>
                    {data.actions}
                  </span>
                );
              },
            },
            {
              label: 'Operation',
              width: '100px',
              props: 'operation',
              render: (data, col, index) => {
                console.log('Operation2 data', data);
                console.log('Operation2 col', col);
                console.log('Operation2 col index', index);
                switch (index) {
                  // case 0:
                  //   return (<div className="d-flex">
                  //     <Button type="success" className="d-block m-auto mr-2" size="mini"
                  //       onClick={ () => { data.operation(true) } }>On</Button>
                  //     <Button type="danger" className="d-block m-auto" size="mini"
                  //       onClick={ () => { data.operation(false) } }>Off</Button>
                  //   </div>)
                  case 0:
                    return (
                      <div>
                        <Button
                          type="info"
                          className="d-block m-auto"
                          size="small"
                          onClick={() => {
                            data.operation(false);
                          }}
                        >
                          Request
                        </Button>
                      </div>
                    );
                }
              },
            },
          ],
          data: [
            //   {
            //   actions: 'Toggle Edit Privilege',
            //   information: "Allows authors to edit the proposal",
            //   operation: (val) => {
            //     this.setState({ actionsLoading: true })
            //     this.props.updateField({
            //       collection: PROPOSALS,
            //       field: "isEditable",
            //       value: val,
            //       id: this.props.proposal.uid
            //     }).then(res => {
            //       // console.log("ProposalEvaluator res allow user", res)
            //       // this.props.logActivity({emailList, message}, this.props.proposal.uid).then(() => {
            //       //   Message({ type: 'info', message: 'Operation canceled'});
            //       //   this.props.getActivities(this.props.proposal.uid);
            //       // })
            //       let message = "";
            //       this.setState({ actionsLoading: false })
            //       if ( res && val === true) {
            //         message = `Edit privileges granted to authors`;
            //         Message({
            //           message: 'The proposal can now be editted.',
            //           type: 'info'
            //         });

            //       } else if ( res && val === false) {
            //         message = `Edit privileges have been revoked`
            //         Message({
            //           message: 'The proposal cannot be editted anymore.',
            //           type: 'error'
            //         });
            //       }
            //       return Promise.resolve({message});
            //     })
            //     .then(activityObj => {
            //       return this.props.logActivity({collection: PROPOSALS, collectionId: this.props.proposal.uid, data: {...activityObj}})
            //     })
            //     .then(() => {
            //       this.props.getActivities({collection: PROPOSALS, collectionId: this.props.proposal.uid});
            //     })
            //     .catch(err => {
            //       alert("Error: ProposalEvaluator Toggle Edit Privilege");
            //     })
            //   }
            // },
            {
              actions: 'Request More Information',
              information:
                'Sends an email to the authors to request more information',
              operation: () => {
                this.setState({ actionsLoading: true });
                // send user email
                this.props
                  .updateField({
                    collection: PROPOSALS,
                    field: 'isEditable',
                    value: true,
                    id: this.props.proposal.uid,
                  })
                  .then((res) => {
                    let message = '';
                    if (res) {
                      message = 'Edit privileges granted to authors';
                    } else {
                      message = 'Granting authors edit privilege failed!';
                    }
                    return Promise.resolve({ message });
                  })
                  .then((activityObj) => {
                    return this.props.logActivity({
                      collection: PROPOSALS,
                      collectionId: this.props.proposal.uid,
                      data: { ...activityObj },
                    });
                  })
                  .then(() => {
                    this.setState({ actionsLoading: false });
                    Notification({
                      title: 'Success',
                      message:
                        'An email has been sent to the user to ask for more information',
                      type: 'warning',
                    });
                    this.props.getActivities({
                      collection: PROPOSALS,
                      collectionId: this.props.proposal.uid,
                    });
                  });
              },
            },
          ],
        },
        {},
      ],
      PROPOSAL_EVALUATOR_STEPS: [
        {
          title: 'Step 1',
          description: 'Begin to review.',
          buttonTitle: 'Start Review',
          buttonType: 'primary',
          processStatus: 'process',
          stepDisabled: false,
          nextButtonFunction: () => {
            const message = `Started proposal review process`;
            const currUserId = this.props.currUserId;
            const keyedObj = this.props.keyedSysUsers;
            return this.props
              .updateField({
                collection: PROPOSALS,
                field: 'currentStep',
                value: 1,
                emailList: [
                  ...this.props.proposal.emailList,
                  getField({ id: currUserId, field: 'email', keyedObj }),
                ],
                id: this.props.proposal.uid,
              })
              .then(() => {
                return this.props.logActivity({
                  collection: PROPOSALS,
                  collectionId: this.props.proposal.uid,
                  data: { message },
                });
              })
              .then(() => {
                Message({ type: 'info', message: 'Operation canceled' });
                this.props.getActivities({
                  collection: PROPOSALS,
                  collectionId: this.props.proposal.uid,
                });
              });
          },
        },
        {
          title: 'Step 2',
          description: 'Ask for feed back.',
          buttonTitle: 'Start Acceptance',
          buttonType: 'warning',
          processStatus: 'process',
          stepDisabled: true,
          disabled: (val) => {
            return val;
          },
          actions: () => {
            return <>{this.getStep2Actions(2)}</>;
          },
          confirm: () => {
            return (
              <>
                {this.state.proposal.isEditable ? (
                  <Alert
                    className="mt-2"
                    type="warning"
                    title="The proposal is still being editted."
                    showIcon={true}
                  />
                ) : (
                  <></>
                )}
                <Button
                  onClick={() => {
                    MessageBox.confirm(
                      'Are you sure you are done with this step?',
                      'Warning',
                      {
                        confirmButtonText: 'Confirm',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                      }
                    )
                      .then(() => {
                        this.setState({
                          nextButtonsDisabled: [
                            ...this.state.nextButtonsDisabled.splice(0, 1),
                            false,
                            ...this.state.nextButtonsDisabled.splice(1),
                          ],
                        });
                      })
                      .catch(() => {
                        Message({
                          type: 'info',
                          message: 'Operation canceled',
                        });
                      });
                  }}
                  className="mt-3 btn-block"
                  disabled={
                    !this.state.nextButtonsDisabled[1] ||
                    this.state.proposal.isEditable
                  }
                >
                  Done
                </Button>
              </>
            );
          },
          nextButtonFunction: () => {
            const message = `Feedback process finished  `;
            return this.props
              .updateField({
                collection: PROPOSALS,
                field: 'currentStep',
                value: 2,
                id: this.props.proposal.uid,
              })
              .then(() => {
                return this.props.logActivity({
                  collection: PROPOSALS,
                  collectionId: this.props.proposal.uid,
                  data: { message },
                });
              })
              .then(() => {
                Message({ type: 'info', message: 'Operation canceled' });
                this.props.getActivities({
                  collection: PROPOSALS,
                  collectionId: this.props.proposal.uid,
                });
              });
          },
        },
        {
          title: 'Step 3',
          description: 'Decide whether to accept or reject.',
          buttonTitle: 'Finish',
          actions: () => {
            return (
              <Loading loading={this.state.actionsLoading}>
                <div className="d-flex justify-content-center">
                  <div className="d-inline-block">
                    <Button
                      size="large"
                      className="mr-2"
                      type="danger"
                      disabled={
                        !this.state.nextButtonsDisabled[2] ||
                        this.props.proposal.status === Status.ACCEPTED ||
                        this.props.proposal.status === Status.REJECTED
                      }
                      onClick={() => {
                        MessageBox.confirm('Confirm Reject', 'Confirm', {
                          confirmButtonText: 'Reject',
                          cancelButtonText: 'Cancel',
                          type: 'error',
                        })
                          .then(() => {
                            this.setState({ actionsLoading: true });
                            this.props
                              .updateField({
                                collection: PROPOSALS,
                                field: 'status',
                                value: Status.REJECTED,
                                id: this.props.proposal.uid,
                              })
                              .then((res) => {
                                if (res) {
                                  this.setState({
                                    nextButtonsDisabled: [
                                      ...this.state.nextButtonsDisabled.splice(
                                        0,
                                        2
                                      ),
                                      false,
                                      ...this.state.nextButtonsDisabled.splice(
                                        2
                                      ),
                                    ],
                                    actionsLoading: false,
                                  });
                                  Notification({
                                    title: 'Rejected',
                                    message: 'You have rejected the proposal',
                                    type: 'error',
                                  });
                                  this.props.logActivity({
                                    collection: PROPOSALS,
                                    collectionId: this.props.proposal.uid,
                                    data: {
                                      message: 'Proposal has been rejected',
                                    },
                                  });
                                }
                              });
                          })
                          .catch(() => {
                            Message({
                              type: 'info',
                              message: 'Operation canceled',
                            });
                          });
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                  <div className="d-inline-block">
                    <Button
                      size="large"
                      className="mr-2"
                      type="success"
                      disabled={
                        !this.state.nextButtonsDisabled[2] ||
                        this.props.proposal.status === Status.ACCEPTED ||
                        this.props.proposal.status === Status.REJECTED
                      }
                      onClick={() => {
                        MessageBox.confirm('Confirm Accept', 'Confirm', {
                          confirmButtonText: 'Accept',
                          cancelButtonText: 'Cancel',
                          type: 'success',
                        })
                          .then(() => {
                            this.setState({ actionsLoading: true });
                            this.props
                              .updateField({
                                collection: PROPOSALS,
                                field: 'status',
                                value: Status.ACCEPTED,
                                id: this.props.proposal.uid,
                              })
                              .then((res) => {
                                console.log('Accept proposal: res', res);
                                if (res) {
                                  this.setState({
                                    nextButtonsDisabled: [
                                      ...this.state.nextButtonsDisabled.splice(
                                        0,
                                        2
                                      ),
                                      false,
                                      ...this.state.nextButtonsDisabled.splice(
                                        2
                                      ),
                                    ],
                                    actionsLoading: false,
                                  });
                                  Notification({
                                    title: 'Success',
                                    message: 'You have accepted the proposal',
                                    type: 'success',
                                  });
                                  this.props.logActivity({
                                    collection: PROPOSALS,
                                    collectionId: this.props.proposal.uid,
                                    data: {
                                      message: 'Proposal has been accepted',
                                    },
                                  });
                                }
                              });
                          })
                          .catch(() => {
                            Message({
                              type: 'info',
                              message: 'Operation canceled',
                            });
                          });
                      }}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </Loading>
            );
          },
          confirm: () => {
            console.log('Hi');
          },
          nextButtonFunction: () => {
            this.setState({
              nextButtonsDisabled: [
                ...this.state.nextButtonsDisabled.splice(0, 3),
                true,
              ],
            });
            const message = `Proposal decision finalized`;
            return this.props
              .updateField({
                collection: PROPOSALS,
                field: 'currentStep',
                value: 3,
                id: this.props.proposal.uid,
              })
              .then(() => {
                return this.props.logActivity({
                  collection: PROPOSALS,
                  collectionId: this.props.proposal.uid,
                  data: { message },
                });
              })
              .then(() => {
                Message({ type: 'info', message: 'Operation canceled' });
                this.props.getActivities({
                  collection: PROPOSALS,
                  collectionId: this.props.proposal.uid,
                });
              });
          },
        },
      ],
    };
  }

  componentDidMount = () => {
    this.setState({
      active: this.props.proposal.currentStep || 0,
      proposal: this.props.proposal,
    });
  };

  decisionMade = (proposal) => {
    const { status } = proposal;
    if ((status && status === Status.ACCEPTED) || status === Status.REJECTED) {
      return true;
    } else {
      return false;
    }
  };

  onDismiss = () => {
    this.setState({
      visible: true,
    });
  };

  getStep2Actions = (val) => {
    val = val - 1; // acocunt for index
    const { actionsTable } = this.state;
    const columns =
      actionsTable && actionsTable[val] && actionsTable[val].columns;
    const data = actionsTable && actionsTable[val] && actionsTable[val].data;
    console.log('getStep2Actions', actionsTable);
    console.log('getStep2Actions columns', columns);
    console.log('getStep2Actions data', data);
    return (
      <Loading loading={this.state.actionsLoading}>
        <Table style={{ width: '100%' }} columns={columns} data={data} />
      </Loading>
    );
  };

  done = () => {
    console.log('done with proposalevaluator');
    this.props.updateField({
      collection: PROPOSALS,
      field: 'isFinalized',
      value: true,
      id: this.props.proposal.uid,
    });
  };

  next = () => {
    let active = this.state.active;
    let length = this.state.PROPOSAL_EVALUATOR_STEPS.length - 1;
    if (active <= length) {
      active++;
    }
    if (active > length) {
      this.setState({
        nextButtonsDisabled: [
          ...this.state.nextButtonsDisabled.splice(0, 3),
          true,
        ],
      });
    }
    this.setState({ active });
  };

  render() {
    const {
      active,
      PROPOSAL_EVALUATOR_STEPS,
      buttonDisabled,
      nextButtonsDisabled,
    } = this.state;
    return (
      <Evaluator
        next={this.next}
        nextButtonsDisabled={nextButtonsDisabled}
        buttonDisabled={buttonDisabled}
        active={active}
        done={this.done}
        steps={PROPOSAL_EVALUATOR_STEPS}
        direction={'vertical'}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currUserId: state.auth.user.uid,
    keyedSysUsers: state.system.keyedSysUsers,
  };
};

export default connect(mapStateToProps, {
  updateField,
  logActivity,
  getActivities,
})(ProposalEvaluator);
