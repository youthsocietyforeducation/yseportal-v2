import React from 'react';
import { Modal } from 'antd';

import BaseForm from './BaseForm';
import { FAQS } from './FaqFormType';

class EditModal extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Modal 
                width={"50%"}
                title= {<h4 className="text-primary">Edit FAQ</h4>}
                visible={this.props.visible || false } 
                onCancel={this.props.onCancel}
                footer={null}
            >
                <BaseForm
                    editItem = {this.props.editItem}
                    onCancel = {this.props.onCancel}
                    action = {FAQS.PROPOSAL.EDIT}
                />
            </Modal>
        )
    }
}
export default EditModal;