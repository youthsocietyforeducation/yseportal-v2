import React from 'react';
import {connect} from 'react-redux';
import { Form, Input,Button } from 'antd';

import {BSCancelButton,BSSubmitButton} from '../../../ReusableComponents/Buttons/BSButton';
import {editProposalFaqData,insertProposalFaqData} from '../../../../redux/actions/systemActions';
import { getDateAndTime } from '../../../../utils/dateUtils';
import {FAQS} from './FaqFormType';

const { TextArea } = Input;

class BaseForm extends React.Component{
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  onReset = () => {
    this.formRef.current.resetFields();
  }

  initialValue = () => {
    const init = this.props.editItem?
    {
      question:this.props.editItem.question,
      answer:this.props.editItem.answer,
      order:this.props.editItem.order,
    }:
    {
      question:"",
      answer:"",
      order:"",
    }
    this.formRef.current.setFieldsValue(init);
  }


  componentDidMount(){
    this.initialValue()
  }


  componentDidUpdate(){
    this.initialValue()
  }

  onFinish = values => {
    switch(this.props.action){
      case FAQS.PROPOSAL.EDIT:
        const update = {
          uid:this.props.editItem.uid,
          question:values.question,
          answer:values.answer,
          updated:getDateAndTime(new Date()),
          updatedBy:this.props.user.uid,
          order:values.order?values.order:0,
        };
        this.props.editProposalFaqData(update,this.props.editItem.uid);
        break;

      case FAQS.PROPOSAL.CREATE:
        const newFaq = {
          question: values.question,
          answer: values.answer,
          updated: getDateAndTime(new Date()),
          created: getDateAndTime(new Date()),
          section: "proposal",
          createdBy: this.props.user.uid,
          updatedBy: this.props.user.uid,
          order: values.order?values.order:0
        };
        this.props.insertProposalFaqData(newFaq);
        break;
      default: console.log("ACTION IS ::",this.props.action);this.props.onCancel();
    }

    this.props.onCancel();
  };

  render(){
    return(
      <Form ref={this.formRef} name={this.props.action} onFinish={this.onFinish} layout="vertical">
        <Form.Item 
          name="question" 
          label="Question"
          rules={[{ required: true, message: 'Please fill out Question' }]}
        >
          <Input placeholder="Question"/>
        </Form.Item>

        <Form.Item 
          name="answer" 
          label="Answer"
          rules={[{ required: true, message: 'Please fill out Answer' }]}
        >
          <TextArea placeholder="Answer"/>
        </Form.Item>

        <Form.Item
          name="order"
          label="Order"
        >
          <Input placeholder="Order Number" type="number"/>
        </Form.Item>
  
      <div className="mt-2 d-flex justify-content-between">
        <div>
          <Button htmlType="button" onClick={this.onReset}>
            Clear All
          </Button>
        </div>
        <div>
            <BSCancelButton className="mr-2" onClick = {this.props.onCancel}/>
            <BSSubmitButton htmltype="submit"/>
        </div>
      </div>

      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user:state.auth.user,
  }
}
export default connect(mapStateToProps,{editProposalFaqData,insertProposalFaqData})(BaseForm);