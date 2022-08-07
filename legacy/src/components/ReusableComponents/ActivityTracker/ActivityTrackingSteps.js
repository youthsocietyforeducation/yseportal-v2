import React from 'react'; 
import { Steps, Button, Card} from 'element-react'; 
import ActivityItem from './ActivityItem';
import { connect } from 'react-redux';
import {

} from '../../../redux/actions'

class ActivityTrackingSteps extends React.Component {
    constructor(props) {
        super(props);
      
        this.state = {
          active: 0,
          steps: this.props.steps || [],
        };
      }

      componentDidMount = () => {
          console.log("AST activities", this.props.steps)
        //   const { steps } = this.props; 
        //   console.log("activities ATS activities", this.props.activities)
        //   if (steps) {
        //       this.setState({
        //           steps: steps 
        //       })
        //   }
      }

      renderSteps = (steps) => {
          
          if (steps) {
            return (
                steps.map((step, index) => {
                  const updatedByUser = this.props.keyedSysUsers && this.props.keyedSysUsers[step.updatedBy];
                  const updatedBy = updatedByUser && `${updatedByUser.firstName} ${updatedByUser.lastName}`;
                  const isCurrentUser = this.props.currUserId === step.updatedBy; 
                    return <Card className="mb-2" key={index} type="box-card">
                      <div className="text item">
                        <div>
                        </div>
                        <div>
                          <p className="mb-0">{step.message}</p>
                          <small> { isCurrentUser ? <span className="text-primary font-weight-bold">{updatedBy || "" }</span> :
                           <span className="text-muted font-weight-bold">{updatedBy || "" }</span> } | <span className="text-muted">{step.updatedDate} | {steps.length-index}</span></small>
                        </div>
                      </div>
                    </Card>
                })
            )
          } else {
              return <></>
          }
      }

    //   next = () => {
    //     const {next, steps, active}  = this.props; 
    //     next(); 
    //     if (steps[active].nextButtonFunction) {
    //       steps[active].nextButtonFunction(); 
    //     }
    //   }

      render() {
        const { steps, active } = this.props; 
        // console.log("ActivityTrackingSteps", steps); 
        // console.log("ActivityTrackingSteps props", this.props); 
        // const validStep = active < steps.length; 
        return (
          <div>
            <div className="row">
                <div className="col-sm-12">
                    {/* <Button disabled={ validStep && nextButtonsDisabled[active] }
                      className="btn-block" 
                      type={validStep && steps[active].buttonType} 
                      onClick={this.next}>{validStep && steps[active].buttonTitle || "Done" }</Button> */}
                      <p className="text-muted text-center"><small>Most Recent</small></p>
                    { this.renderSteps(steps || []) }
                    {/* <Steps className="mt-3" 
                      direction={this.props.direction || "vertical"} 
                      active={this.props.steps.length || 0} 
                      finishStatus={"wait"}>
                        
                    </Steps> */}
                </div>
            </div>
          </div>
        )
      }
}

const mapStateToProps = state => {
  return {
    currUserId: state.auth.user.uid,
    keyedSysUsers: state.system.keyedSysUsers,
  }
}

export default connect(
  mapStateToProps,
  {  }
)(ActivityTrackingSteps)
