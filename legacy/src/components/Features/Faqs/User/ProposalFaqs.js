import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import FaqsBaseComponent from '../FaqsBaseComponent';
import {getProposalFaqData} from '../../../../redux/actions/systemActions';

class ProposalFaqs extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.props.getProposalFaqData();
    }

    render(){
        return(
            <FaqsBaseComponent items = {this.props.faqs} />
        )
    }
}
const mapStateToProps = (state) => {
    let sorted_faq_by_order = _.sortBy(state.system.proposalFaq, (faq) => {
        return _.parseInt(faq.order)
    });


    return {
        faqs:sorted_faq_by_order
    };
}

export default connect(mapStateToProps,{
    getProposalFaqData,
})(ProposalFaqs);