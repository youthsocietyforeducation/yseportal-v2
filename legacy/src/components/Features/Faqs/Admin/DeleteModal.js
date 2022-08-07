import React from 'react';
import { Modal } from 'antd';
import {connect} from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';

import {removeProposalFaqData} from '../../../../redux/actions/systemActions';

class DeleteModal extends React.Component{

    constructor(props){
        super(props);
    }
    
    handleOk = () => {
      this.props.removeProposalFaqData(this.props.deleteItem.uid);
      this.props.onCancel();
    }

    renderOkText = () =>{
        return(
            <>
            <DeleteOutlined className="mr-2"/>
            Delete
            </>
        )
    }

    render(){
        return(
                <Modal 
                    title={<h4 className="text-danger">Delete Current Selected FAQ</h4>}
                    visible={this.props.visible || false } 
                    onOk={this.handleOk} 
                    okText = {this.renderOkText()}
                    okType="danger"
                    onCancel={this.props.onCancel}
                >

                   {this.props.deleteItem?
                        <div className="d-flex flex-column align-items-center p-3">
                            <p style={{fontSize:18}} className="text-center">Are you sure want to delete this record ? This process 
                            <span className="ml-1" style={{fontWeight:"bold"}}>cannot be undone.</span></p>
                        </div>  
                   :null
                   }

                </Modal>
        )
    }
}
export default connect(null,{removeProposalFaqData})(DeleteModal);