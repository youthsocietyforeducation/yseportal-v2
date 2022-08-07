import React from 'react';
import SimpleAccordion from '../../ReusableComponents/Accordions/SimpleAccordion';

class FaqsBaseComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    renderHeader() {
        return (
            this.props.title ?
                <div>
                    <h4 style={{ color: "#0078d8", display: "inline" }}>
                        {this.props.title}
                    </h4>
                    <span style={{ float: "right" }}>
                        {this.props.button ? this.props.button : null}
                    </span>
                </div> :
                this.props.button ?
                    <span>
                        {this.props.button}
                    </span> :
                    null
        )
    }

    changeDataFormat = (faqs) => {
        return faqs.map((faq) => {
            return {
                id:faq.uid,
                header:faq.question,
                paragraph:faq.answer,
                order:faq.order,
            }
        })
    }
    render(){
        return(
            <div>
                <div className="mb-2">{this.renderHeader()}</div>
                <SimpleAccordion items = {this.changeDataFormat(this.props.items)}>
                    {this.props.children}
                </SimpleAccordion>
            </div>
        )
    }
}
export default FaqsBaseComponent;