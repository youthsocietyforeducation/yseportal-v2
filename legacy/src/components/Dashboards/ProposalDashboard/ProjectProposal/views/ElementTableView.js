import React from 'react';
import { Component } from 'react';
import ElementTable from '../../../../ReusableComponents/ElementTable/ElementTable'; 
import { 
    processProposal, tableColumns
} from '../controls/processor'; 
import { Button } from 'element-react'; 
    
/**
 * Updated: May 13th 2020
 * Authors: Kaung Yang & Elizabeth Chen 
 * 
 * Description: 
 * WRITE HERE
 */
class ElementTableView extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            proposals: [], 
            columns: [], 
            data: [], 
        }
    }

    getTableColumns = () => {
        return tableColumns; 
    }

    getTableData = (proposals) => {
        let data = [];
        if(proposals) {
            console.log(pC, "getTableData", proposals); 
                proposals.forEach(proposal => {
                const newObj = processProposal(proposal); 
                data.push(newObj); 
            })
        }
        return data; 
    }

    render() {
        const {proposals} = this.props;  
        return(
            <ElementTable columns={this.getTableColumns()} data={this.getTableData(proposals)}/>
        )
    }
}


export default ElementTableView; 

const pC = "ElementTableView"; 
