import React from 'react';
import { Modal } from 'antd';

import BaseForm from './BaseForm';
import { FAQS } from './FaqFormType';

class CreateModal extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Modal 
                width={"50%"}
                title={ <h4 className="text-primary">Create New Proposal FAQ</h4> }
                visible={this.props.visible || false } 
                onCancel={this.props.onCancel}
                footer={null}
            >
                <BaseForm
                    onCancel = {this.props.onCancel}
                    action = {FAQS.PROPOSAL.CREATE}
                />
            </Modal>
        )
    }
}
export default CreateModal;