import React from 'react';
import {Collapse,List} from 'antd';
const {Panel} = Collapse;


class SimpleAccordion extends React.Component{
    constructor(props){
        super(props);
    }

    renderChildren = (children,id,order) =>{
        return (
        <>
            {order?
            <span className="btn btn-success btn-sm mr-1 border rounded-pill">Order: {order}</span>:null
            }
            {
                children.map((child,index) => {
                return (
                <a 
                    key = {`${id}of${index}`} 
                    className = "mr-1" 
                    onClick = { child.props.buttonclick?(event) => child.props.buttonclick(event,id):null} >
                    {child}
                </a>
                    )
                 })
             }
        </>
       
        );
    }

    renderAccordionItems = (items) =>{
        return items.map((item,index)=>{
            return (
                <Panel
                    key = {item.id || index}
                    header = {item.header}
                    extra = { this.props.children?this.renderChildren(this.props.children,item.id,item.order || null):null}
                >
                    <p> {item.paragraph} </p>
                </Panel>
            )
        })
    }

    render(){
        if (this.props.items.length != 0){
            return(
                <Collapse accordion>
                    {this.renderAccordionItems(this.props.items ||[])}
                </Collapse>
            )
        }else{
            return <List/>
        }
        
    }
}

export default SimpleAccordion;