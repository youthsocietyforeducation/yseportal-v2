import React from 'react';
import { connect } from "react-redux";
import _ from 'lodash';

import { PageTitle } from '../../../ReusableComponents/Page';
import { getProposalFaqData } from '../../../../redux/actions/systemActions';
import FaqsBaseComponent from '../FaqsBaseComponent';
import {BSEditButton,BSDeleteButton,BSNewButton} from "../../../ReusableComponents/Buttons/BSButton";
import CreateModal from './CreateModal';
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';

class FAQList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            deleteModalVisible:false,
            deleteItem:null,

            editModalVisible:false,
            editItem:null,

            createModalVisible:false,
        };
    }
    componentDidMount() {
        this.props.getProposalFaqData();
    }

    searchItemById = (key) =>{
        return this.props.faqs.find( (faq) =>{
            return faq.uid === key;
        })
    }

    onEdit = (event,key) => {
        event.stopPropagation();
        const editItem = this.searchItemById(key);
        this.setState({
            editModalVisible:true,
            editItem:editItem,
        });
    }

    onDelete = (event,key) => {
        event.stopPropagation();
        const deleteItem = this.searchItemById(key);
        this.setState({
            deleteModalVisible: true,
            deleteItem: deleteItem,
        });
    }

    onCreateNewFaq = () => {
        this.setState({
            createModalVisible:true,
        })
    }

    renObjData = () => {
        const button = [
            <BSEditButton key={1} buttonclick = {this.onEdit}/>,
            <BSDeleteButton key={2} buttonclick = {this.onDelete} />,
        ]
        return (
            <FaqsBaseComponent items={this.props.faqs}
                button = { < BSNewButton onClick={this.onCreateNewFaq}/> }
            >
                {button}
            </FaqsBaseComponent>
        )
    }
    render() {
        return (
            <div>
                <PageTitle title="FAQS (Admin)" />
                <div>
                    {this.renObjData()}

                    <CreateModal
                        visible = {this.state.createModalVisible}
                        onCancel = { () => this.setState({createModalVisible:false})}
                    />

                    <DeleteModal 
                        visible = {this.state.deleteModalVisible}
                        onCancel = { () => this.setState({deleteModalVisible:false})}
                        deleteItem = {this.state.deleteItem}
                    />

                    <EditModal
                        visible = {this.state.editModalVisible}
                        onCancel = { () => this.setState({editModalVisible:false})}
                        editItem = {this.state.editItem}
                    />

                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    //const sorted_faq_by_order = _.orderBy(state.system.proposalFaq,['order'],['desc'] );
    const sorted_faq_by_order = _.sortBy(state.system.proposalFaq, (faq) => {
        return _.parseInt(faq.order)            // ascending order
    //  return -1*_.parseInt(faq.order);        // descending order
    });

    return {
        faqs:sorted_faq_by_order
    }
}

export default connect(mapStateToProps, { 
    getProposalFaqData, 
})(FAQList);