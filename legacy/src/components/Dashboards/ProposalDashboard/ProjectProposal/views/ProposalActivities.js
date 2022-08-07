import React from 'react'; 
import { connect } from "react-redux";
import {
    getActivities,
} from "../../../../../redux/actions";
import ActivityTrackingSteps from '../../../../ReusableComponents/ActivityTracker/ActivityTrackingSteps'
import { Loading } from 'element-react'; 

class ProposalActivities extends React.Component {

    constructor(props) {
        super(props); 
        this.state = {
            loading: false,
            proposalId: this.props.proposalId,
            touched: this.props.touched, 
            PROPOSAL_ACTIVITIES: [], 
        }
    }

    componentDidMount = () => {
        console.log("PACT componentDidMount state", this.state.proposalId)
        console.log("PACT componentDidMount props", this.props.activities)
        // this.setState({ loading: true })
        // this.props.getActivities(this.props.proposalId).then(() => {
        //     console.log("componentDidMount activities", this.props.activities);
        //     if (this.props.activities && this.props.activities.length > 0) {
        //         let activities = this.props.activities.map(a => {
        //             console.log("cDM activities item", a); 
        //             const stringDate = a.updatedDate; 
        //             const timezone = stringDate.substring(stringDate.indexOf("(") - 1, stringDate.indexOf(")") + 1); 
        //             const newDateObj = new Date(Date.parse(a.updatedDate)); 

        //             return {
        //                 ...a,
        //                 updatedDate: `${newDateObj.toDateString()} ${newDateObj.toLocaleTimeString()} ${timezone}`, 
        //             }
        //         })
        //         console.log("after map activities", activities)
        //         this.setState({ PROPOSAL_ACTIVITIES: [...activities] }); 
        //     }
        //     this.setState({ loading: false })
        // })
    }

    renderActivities = () => {
        const { activities } = this.props; 
        console.log("activities renderActivities", this.props.activities);
        if (activities && activities.length > 0) {
            return (
                <Loading loading={this.state.loading}>
                    <ActivityTrackingSteps steps={activities}/>
                </Loading>
            )
        } 
        
    }

    render = () => {
        return (
            <div>
                {this.renderActivities()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        activities: state.proposal.activities,
        keyedSysUsers: state.system.keyedSysUsers,
    }
  }
  
export default connect(
mapStateToProps,
{ getActivities }
)(ProposalActivities)